import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './app.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Preloader } from '@components/preloader/preloader.jsx';
// import { INGREDIENTS_ENDPOINT } from '@utils/constants.js';
import { fetchIngredients } from '../../services/ingredientsSlice';

export const App = () => {
	const dispatch = useDispatch();
	const { isLoading, hasError } = useSelector((state) => state.ingredients);

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	return (
		<div className={styles.app}>
			<AppHeader />
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<main className={`${styles.main} pl-5 pr-5`}>
				{isLoading ? (
					<Preloader />
				) : hasError ? (
					<p className='text text_type_main-medium text_color_error'>
						Произошла ошибка при загрузке ингредиентов. Пожалуйста, попробуйте
						позже.
					</p>
				) : (
					<>
						{/* No props needed - components get data from Redux */}
						<BurgerIngredients />
						<BurgerConstructor />
					</>
				)}
			</main>
		</div>
	);
};
