export const ItemButtonArea = ({ item, dispatch }) => {
	const handleAddClick = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		dispatch({
			type: 'beginAddingItem',
			payload: { item },
		});
	};

	return (
		<>
			<div className="buttonArea">
				{!item.isEditing && !item.isDeleting && (
					<>
						<button
							disabled={item.isProcessing}
							onClick={() =>
								dispatch({
									type: 'toggleEditStatus',
									payload: { item },
								})
							}
						>
							Edit
						</button>
						<button
							disabled={item.isProcessing}
							onClick={() =>
								dispatch({
									type: 'askIfSureForDelete',
									payload: { item },
								})
							}
						>
							Delete
						</button>
						<button
							onClick={handleAddClick}
							disabled={item.isProcessing}
						>
							Add
						</button>
					</>
				)}
				{item.isEditing && (
					<>
						<button
							disabled={item.isProcessing}
							onClick={() =>
								dispatch({
									type: 'cancelEditStatus',
									payload: { item },
								})
							}
						>
							Cancel
						</button>
						<button
							disabled={item.isProcessing}
							onClick={() =>
								dispatch({
									type: 'saveItem',
									payload: { item },
								})
							}
						>
							Save
						</button>
					</>
				)}
				{item.isDeleting && (
					<>
						<button
							disabled={item.isProcessing}
							onClick={() =>
								dispatch({
									type: 'cancelDeleteStatus',
									payload: { item },
								})
							}
						>
							Cancel
						</button>
						<button
							disabled={item.isProcessing}
							onClick={() =>
								dispatch({
									type: 'deleteItem',
									payload: { item },
								})
							}
						>
							Yes, delete item!
						</button>
					</>
				)}
			</div>
		</>
	);
};
