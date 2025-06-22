import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { Home } from '../../pages/home/home';
// import styles from './app.module.css';

export const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	return (
		<>
			<AppHeader />
			<Routes>
				<Route path='/' element={<Home />} />
			</Routes>
		</>
	);
};
