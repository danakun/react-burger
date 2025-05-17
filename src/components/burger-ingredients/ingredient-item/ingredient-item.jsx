import React from 'react';
import styles from './ingredient-item.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import {
	CurrencyIcon,
	Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';

export const IngredientItem = ({ ingredient }) => {
	return (
		<li className={`${styles.ingredient} pt-6 pb-8 pl-4 pr-4`}>
			<Counter count={1} size='default' extraClass='m-1' />
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
	count: PropTypes.number,
};
