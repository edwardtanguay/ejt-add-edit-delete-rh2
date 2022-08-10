import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:4555';

export const AppContext = createContext();

const initialState = {
	count: 0,
	germanNouns: [],
};

function reducer(state, action) {
	const _state = { ...state };
	let item = null;
	let property = null;
	let value = null;
	let originalItem = null;
	let message = null;
	switch (action.type) {
		case 'increaseCount':
			_state.count++;
			break;
		case 'decreaseCount':
			_state.count--;
			break;
		case 'loadGermanNouns':
			_state.germanNouns = action.payload.germanNouns;
			break;
		case 'toggleEditStatus':
			item = action.payload.item;
			item.isEditing = !item.isEditing;
			item.message = item.isEditing ? 'Editing item...' : '';
			break;
		case 'changeItemRowValue':
			item = action.payload.item;
			property = action.payload.property;
			value = action.payload.value;
			item[property] = value;
			break;
		case 'cancelEditStatus':
			item = action.payload.item;
			originalItem = item.originalItem;

			item.isEditing = false;
			item.message = '';
			item.article = originalItem.article;
			item.singular = originalItem.singular;
			item.plural = originalItem.plural;
			break;
		case 'cancelDeleteStatus':
			item = action.payload.item;

			item.isDeleting = false;
			item.message = '';
			break;
		case 'saveItem':
			item = action.payload.item;

			item.isEditing = false;
			item.message = '';
			break;
		case 'handleFailure':
			item = action.payload.item;
			originalItem = item.originalItem;
			message = action.payload.message;

			item.isEditing = false;
			item.isDeleting = false;
			item.isProcessing = false;
			item.message = message;
			item.article = originalItem.article;
			item.singular = originalItem.singular;
			item.plural = originalItem.plural;
			break;
		case 'askIfSureForDelete':
			item = action.payload.item;

			item.isDeleting = true;
			break;
		case 'deleteItem':
			item = action.payload.item;

			_state.germanNouns = [
				...state.germanNouns.filter((m) => m.id !== item.id),
			];
			break;
		case 'turnOnProcessingStatus':
			item = action.payload.item;

			item.isProcessing = true;
			break;
	}
	return _state;
}

export const AppProvider = ({ children }) => {
	const [state, dispatchCore] = useReducer(reducer, initialState);

	useEffect(() => {
		(async () => {
			const _germanNouns = (await axios.get(`${baseUrl}/germanNouns`))
				.data;
			_germanNouns.forEach((item) => {
				item.isEditing = false;
				item.isDeleting = false;
				item.isProcessing = false;
				item.message = '';
				item.originalItem = { ...item };
			});
			dispatchCore({
				type: 'loadGermanNouns',
				payload: { germanNouns: _germanNouns },
			});
		})();
	}, []);

	const dispatch = async (action) => {
		const item = action.payload?.item;
		let backendItem = {};
		if (item) {
			backendItem = {
				id: item.id,
				article: item.article,
				singular: item.singular,
				plural: item.plural,
			};
		}
		switch (action.type) {
			case 'saveItem':
				dispatchCore({
					type: 'turnOnProcessingStatus',
					payload: { item },
				});
				try {
					const response = await axios.put(
						`${baseUrl}/germanNouns/${item.id}`,
						backendItem
					);
					if ([200, 201].includes(response.status)) {
						dispatchCore(action);
					} else {
						dispatchCore({
							type: 'handleFailure',
							payload: {
								item,
								message: `API Error: ${response.status}`,
							},
						});
					}
				} catch (err) {
					dispatchCore({
						type: 'handleFailure',
						payload: { item, message: `Error: ${err.message}` },
					});
				}
				break;
			case 'deleteItem':
				dispatchCore({
					type: 'turnOnProcessingStatus',
					payload: { item },
				});
				try {
					const response = await axios.delete(
						`${baseUrl}/germanNouns/${item.id}`,
						backendItem
					);
					if ([200, 201].includes(response.status)) {
						dispatchCore(action);
					} else {
						dispatchCore({
							type: 'handleFailure',
							payload: {
								item,
								message: `API Error: ${response.status}`,
							},
						});
					}
				} catch (err) {
					dispatchCore({
						type: 'handleFailure',
						payload: { item, message: `Error: ${err.message}` },
					});
				}
				break;
			default:
				dispatchCore(action);
				break;
		}
	};

	return (
		<AppContext.Provider
			value={{
				state,
				dispatch,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
