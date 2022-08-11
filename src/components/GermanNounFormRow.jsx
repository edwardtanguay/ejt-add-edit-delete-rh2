import { useContext } from 'react';
import { AppContext } from '../AppContext';

export const GermanNounFormRow = ({ item, label, variable, isAdding, theRef }) => {
	const { state, dispatch } = useContext(AppContext);

	return (
		<div className="row">
			<label>{label}</label>
			{!item.isEditing && !isAdding ? (
				<div className="value">{item[variable]}</div>
			) : (
				<input
					type="text"
					value={item[variable]}
					ref={theRef}
					onChange={(e) =>
						dispatch({
							type: 'changeItemRowValue',
							payload: {
								item,
								property: variable,
								value: e.target.value,
							},
						})
					}
				/>
			)}
		</div>
	);
};
