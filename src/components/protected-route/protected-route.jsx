import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Preloader } from '@components/preloader/preloader.jsx';

export const ProtectedRoute = ({ children, onlyUnAuth = false }) => {
	const { user, isAuthChecked } = useSelector((state) => state.auth);
	const location = useLocation();

	// Показываем загрузку пока проверяем аутентификацию
	if (!isAuthChecked) {
		return <Preloader />;
	}

	// Для защищенных маршрутов, но пользователь не авторизован
	if (!onlyUnAuth && !user) {
		return <Navigate replace to='/login' state={{ from: location }} />;
	}

	// Для маршрутов только неавторизованных, но пользователь авторизован
	if (onlyUnAuth && user) {
		const from = location.state?.from || { pathname: '/' };
		return <Navigate replace to={from} />;
	}

	// Все проверки пройдены, показываем компонент
	return children;
};

// Экспорт удобных обёрток
export const OnlyAuth = ({ children }) => (
	<ProtectedRoute onlyUnAuth={false}>{children}</ProtectedRoute>
);

export const OnlyUnAuth = ({ children }) => (
	<ProtectedRoute onlyUnAuth={true}>{children}</ProtectedRoute>
);
