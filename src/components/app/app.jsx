import React, { useState, useEffect } from 'react';
import styles from './app.module.css';
// import { ingredients } from '@utils/ingredients.js';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Preloader } from '@components/preloader/preloader.jsx';

export const App = () => {
	const [state, setState] = useState({
		isLoading: false,
		hasError: false,
		ingredients: [],
	});

	useEffect(() => {
		const fetchIngredients = async () => {
			try {
				setState((prevState) => ({ ...prevState, isLoading: true }));

				const response = await fetch(
					'https://norma.nomoreparties.space/api/ingredients'
				);

				if (!response.ok) {
					throw new Error(`Failed with status: ${response.status}`);
				}

				const result = await response.json();

				setState({
					isLoading: false,
					hasError: false,
					ingredients: result.data || [],
				});
			} catch (error) {
				console.error('Error fetching ingredients:', error);
				setState({
					isLoading: false,
					hasError: true,
					ingredients: [],
				});
			}
		};

		fetchIngredients();
	}, []);

	return (
		<div className={styles.app}>
			<AppHeader />
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<main className={`${styles.main} pl-5 pr-5`}>
				{state.isLoading ? (
					<Preloader />
				) : state.hasError ? (
					<p className='text text_type_main-medium text_color_error'>
						Произошла ошибка при загрузке ингредиентов. Пожалуйста, попробуйте
						позже.
					</p>
				) : (
					<>
						<BurgerIngredients ingredients={state.ingredients} />
						<BurgerConstructor ingredients={state.ingredients} />
					</>
				)}
			</main>
		</div>
	);
};
