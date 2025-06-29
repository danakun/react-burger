import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './ingredient-details.module.css';
import { Preloader } from '@components/preloader/preloader.jsx';

export const IngredientDetails = () => {
	const { ingredientId } = useParams();
	const [imageLoaded, setImageLoaded] = useState(false);

	// Get ingredient from Redux store by ID
	const ingredient = useSelector((state) =>
		state.ingredients.items.find((item) => item._id === ingredientId)
	);

	// If ingredient not found, show error or nothing
	if (!ingredient) {
		return null; // or return a "not found" message
	}

	return (
		<div className={styles.container}>
			{!imageLoaded && (
				<div className={styles.preloaderWrapper}>
					<Preloader />
				</div>
			)}
			<img
				src={ingredient.image_large}
				alt={ingredient.name}
				className={styles.image}
				onLoad={() => setImageLoaded(true)}
			/>

			<h2 className={`${styles.name} text text_type_main-medium mt-4 mb-8`}>
				{ingredient.name}
			</h2>

			<ul className={styles.nutritionGrid}>
				<li className={styles.nutritionItem}>
					<p className='text text_type_main-default text_color_inactive'>
						Калории,ккал
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient.calories}
					</p>
				</li>

				<li className={styles.nutritionItem}>
					<p className='text text_type_main-default text_color_inactive'>
						Белки, г
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient.proteins}
					</p>
				</li>

				<li className={styles.nutritionItem}>
					<p className='text text_type_main-default text_color_inactive'>
						Жиры, г
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient.fat}
					</p>
				</li>

				<li className={styles.nutritionItem}>
					<p className='text text_type_main-default text_color_inactive'>
						Углеводы, г
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient.carbohydrates}
					</p>
				</li>
			</ul>
		</div>
	);
};
