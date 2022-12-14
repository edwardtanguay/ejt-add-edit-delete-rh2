import { useContext } from 'react';
import { AppContext } from '../AppContext';

import { GermanNounFormRow } from './GermanNounFormRow';

export const ItemAddBox = () => {
	const { state, dispatch, firstAddInputBox } = useContext(AppContext);

	const item = state.addItem;

	return (
		<fieldset className="germanNoun addBox">
			<legend>New German Noun</legend>
			<GermanNounFormRow
				item={item}
				label="Article"
				variable="article"
				isAdding={true}
				theRef={firstAddInputBox}
			/>

			<GermanNounFormRow
				item={item}
				label="Singular"
				variable="singular"
				isAdding={true}
			/>

			<GermanNounFormRow
				item={item}
				label="Plural"
				variable="plural"
				isAdding={true}
			/>

			<div className="buttonRow">
				<div className="message">{state.addMessage}</div>
				<div className="buttonArea">
					<button
						disabled={item.isProcessing}
						onClick={() => dispatch({ type: 'clearAddBox' })}
					>
						Cancel
					</button>
					<button
						disabled={item.isProcessing}
						onClick={() =>
							dispatch({ type: 'addItem', payload: { item } })
						}
					>
						Add Item
					</button>
				</div>
			</div>
		</fieldset>
	);
};
