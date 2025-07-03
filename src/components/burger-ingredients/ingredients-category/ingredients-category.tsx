import React from 'react';
import styles from './ingredients-category.module.css';
import { IngredientItem } from '../ingredient-item/ingredient-item';
import { TIngredientData } from '@/utils/types';

//types

type IngredientsCategoryProps = {
	title: string;
	ingredients: TIngredientData[];
	ids: React.Ref<HTMLDivElement>;
	titleRef: React.RefObject<HTMLHeadingElement>;
};

export const IngredientsCategory = ({
	title,
	ingredients,
	ids,
	titleRef,
}: IngredientsCategoryProps): React.JSX.Element => {
	return (
		<div className={styles['ingredients-category']} ref={ids}>
			<h2 className='text text_type_main-medium mb-6' ref={titleRef}>
				{title}
			</h2>
			<ul className={styles['ingredients-category__list']}>
				{ingredients.map((ingredient: TIngredientData) => (
					<IngredientItem key={ingredient._id} ingredient={ingredient} />
				))}
			</ul>
		</div>
	);
};
