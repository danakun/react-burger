import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './app.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Preloader } from '@components/preloader/preloader.jsx';
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
						<DndProvider backend={HTML5Backend}>
							<BurgerIngredients />
							<BurgerConstructor />
						</DndProvider>
					</>
				)}
			</main>
		</div>
	);
};
