import React from 'react';
import styles from './ingredients-category.module.css';
import * as PropTypes from 'prop-types';
import { IngredientItem } from '../ingredient-item/ingredient-item';
import { ingredientPropType } from '@utils/prop-types.js';

export const IngredientsCategory = ({
	title,
	ingredients,
	ids,
	titleRef,
	onIngredientClick,
}) => {
	return (
		<div className={styles['ingredients-category']} ref={ids}>
			<h2 className='text text_type_main-medium mb-6' ref={titleRef}>
				{title}
			</h2>
			<ul className={styles['ingredients-category__list']}>
				{ingredients.map((ingredient) => (
					<IngredientItem
						key={ingredient._id}
						ingredient={ingredient}
						count={0}
						onClick={() => onIngredientClick(ingredient)}
					/>
				))}
			</ul>
		</div>
	);
};

IngredientsCategory.propTypes = {
	title: PropTypes.string.isRequired,
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
	ids: PropTypes.object,
};
