import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from '../../../services/store';
import { useDrag } from 'react-dnd';
import { DND_TYPES } from '../../../utils/constants';
import styles from './ingredient-item.module.css';
import {
	CurrencyIcon,
	Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { TConstructorIngredient, TIngredientData } from '@/utils/types';

interface IngredientItemProps {
	ingredient: TIngredientData;
}

type DragObject = {
	ingredient: TIngredientData;
};

type DragCollectedProps = {
	isDragging: boolean;
};

export const IngredientItem: React.FC<IngredientItemProps> = ({
	ingredient,
}): React.JSX.Element => {
	const location = useLocation();
	const { bun, ingredients } = useSelector((state) => state.burgerConstructor);

	// all ingredients used
	const count = useMemo((): number => {
		if (ingredient.type === 'bun') {
			// Buns
			return bun && bun._id === ingredient._id ? 2 : 0;
		} else {
			// Count ingredient occurrences
			return ingredients.filter(
				(item: TConstructorIngredient) => item._id === ingredient._id
			).length;
		}
	}, [ingredient, bun, ingredients]);

	// Setup drag
	const [{ isDragging }, dragRef] = useDrag<
		DragObject,
		unknown,
		DragCollectedProps
	>({
		type: DND_TYPES.INGREDIENT,
		item: { ingredient },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<li
			ref={dragRef}
			className={`${styles.ingredient} pt-6 pb-8 pl-4 pr-4 ${
				isDragging ? styles.ingredient_dragging : ''
			}`}
			style={{ opacity: isDragging ? 0.5 : 1 }}>
			<Link
				to={`/ingredients/${ingredient._id}`}
				state={{ background: location }}
				className={styles.ingredient_link}>
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
			</Link>
		</li>
	);
};
