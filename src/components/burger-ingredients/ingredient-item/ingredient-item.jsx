import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import { DND_TYPES } from '../../../utils/constants.js';
import styles from './ingredient-item.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import {
	CurrencyIcon,
	Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';

export const IngredientItem = ({ ingredient, onClick }) => {
	// Get constructor state from Redux to calculate ingredient count
	const { bun, ingredients } = useSelector((state) => state.burgerConstructor);

	// Calculate how many times this ingredient is used in constructor
	const count = useMemo(() => {
		if (ingredient.type === 'bun') {
			// Bun is used twice (top and bottom) if selected
			return bun && bun._id === ingredient._id ? 2 : 0;
		} else {
			// Count how many times this ingredient appears in constructor
			return ingredients.filter((item) => item._id === ingredient._id).length;
		}
	}, [ingredient, bun, ingredients]);

	// Setup drag
	const [{ isDragging }, dragRef] = useDrag({
		type: DND_TYPES.INGREDIENT,
		item: { ingredient },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onClick();
		}
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<li
			ref={dragRef}
			className={`${styles.ingredient} pt-6 pb-8 pl-4 pr-4 ${
				isDragging ? styles.ingredient_dragging : ''
			}`}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			style={{ opacity: isDragging ? 0.5 : 1 }}>
			{/* Show counter */}
			{count > 0 && <Counter count={count} size='default' extraClass='m-1' />}
			<img
				src={ingredient.image}
				alt={ingredient.name}
				className={`${styles.ingredient__image} mb-1`}
			/>
			<div className={`${styles.ingredient__price_container} mb-1`}>
				<span className='text text_type_digits-default mr-2'>
					{ingredient.price}
				</span>
				<CurrencyIcon type='primary' />
			</div>
			<p className={`${styles.ingredient__name} text text_type_main-default`}>
				{ingredient.name}
			</p>
		</li>
	);
};

IngredientItem.propTypes = {
	ingredient: ingredientPropType.isRequired,
	onClick: PropTypes.func.isRequired,
};
