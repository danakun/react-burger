import styles from './ingredient-page.module.css';
import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';

export const IngredientPage = () => {
	return (
		<>
			<div className={styles.ingredient_section}>
				<h1
					className={`${styles.ingredient_page_title} text text_type_main-large`}>
					Детали ингредиента
				</h1>
				<IngredientDetails />
			</div>
		</>
	);
};
