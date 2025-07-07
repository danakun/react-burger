import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import styles from './filling-item.module.css';
import {
	DragIcon,
	ConstructorElement,
} from '@ya.praktikum/react-developer-burger-ui-components';
// @ts-expect-error "Ignore"
import { removeIngredient } from '../../../services/constructorSlice';
import { DND_TYPES } from '../../../utils/constants';
import { TIngredientData } from '@/utils/types';

interface FillingItemProps {
	filling: TIngredientData & { ingredientId: string };
	index: number;
	moveCard: (dragIndex: number, hoverIndex: number) => void;
	isDraggable?: boolean;
}

type DragObject = {
	index: number;
	filling: TIngredientData;
};

// Drag collect interface
type DragCollectedProps = { isDragging: boolean };

export const FillingItem: React.FC<FillingItemProps> = ({
	filling,
	index,
	moveCard,
	isDraggable = true,
}): React.JSX.Element => {
	const dispatch = useDispatch();
	const ref = useRef<HTMLLIElement>(null);

	// Setup drag
	const [{ isDragging }, drag] = useDrag<
		DragObject,
		unknown,
		DragCollectedProps
	>({
		type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
		item: () => ({ index, filling }),
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	// Setup drop
	const [, drop] = useDrop<DragObject, unknown, unknown>({
		accept: DND_TYPES.CONSTRUCTOR_INGREDIENT,
		hover: (item, monitor) => {
			if (!ref.current) {
				return;
			}

			const dragIndex = item.index;
			const hoverIndex = index;

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();
			if (clientOffset === null) {
				return; // or throw an error, depending on your requirements
			}
			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Time to actually perform the action
			moveCard(dragIndex, hoverIndex);

			item.index = hoverIndex;
		},
	});

	// Connect drag and drop to the same element
	drag(drop(ref));

	const handleDelete = (): void => {
		// Remove ingredient from constructor using its Id
		dispatch(removeIngredient(filling.ingredientId));
	};

	return (
		<li
			ref={ref}
			className={`${styles.filling_item} ${isDragging ? styles.filling_item_dragging : ''}`}
			style={{ opacity: isDragging ? 0 : 1 }}>
			<div className={styles.drag_handle}>
				{isDraggable && <DragIcon type='primary' />}
			</div>
			<ConstructorElement
				text={filling.name}
				price={filling.price}
				thumbnail={filling.image}
				handleClose={handleDelete}
			/>
		</li>
	);
};
