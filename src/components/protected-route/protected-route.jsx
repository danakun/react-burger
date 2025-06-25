// components/protected-route/protected-route.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIsAuthChecked, getUserData } from '../../services/userSlice';
import { Preloader } from '@components/preloader/preloader.jsx';

export const ProtectedRoute = ({
	component,
	onlyUnAuth = false,
	requiresForgotPassword = false,
}) => {
	const user = useSelector(getUserData);
	const isAuthChecked = useSelector(getIsAuthChecked);
	const location = useLocation();
	const navigate = useNavigate();
	const [shouldNavigateBack, setShouldNavigateBack] = useState(false);

	useEffect(() => {
		if (requiresForgotPassword) {
			const canResetPassword = localStorage.getItem('resetPassword');
			if (!canResetPassword) {
				setShouldNavigateBack(true);
				navigate(-1);
			}
		}
	}, [requiresForgotPassword, navigate]);

	if (!isAuthChecked) {
		return <Preloader />;
	}

	if (shouldNavigateBack) {
		return <Preloader />;
	}

	// Check if reset password is allowed
	if (requiresForgotPassword) {
		const canResetPassword = localStorage.getItem('resetPassword');
		if (!canResetPassword) {
			return <Preloader />;
		}
	}

	// Для защищенных маршрутов и пользователь не авторизован
	if (!onlyUnAuth && !user) {
		return <Navigate replace to='/login' state={{ from: location }} />;
	}

	// Для неавторизованных маршрутов, но пользователь авторизован
	if (onlyUnAuth && user) {
		const from = location.state?.from || { pathname: '/' };
		return <Navigate replace to={from} />;
	}

	// Все проверки пройдены, показываем компонент
	return component;
};

// Экспорт обёрток
export const OnlyAuth = ({ component }) => (
	<ProtectedRoute component={component} onlyUnAuth={false} />
);

export const OnlyUnAuth = ({ component }) => (
	<ProtectedRoute component={component} onlyUnAuth={true} />
);

export const ResetPasswordProtected = ({ component }) => (
	<ProtectedRoute
		component={component}
		onlyUnAuth={true}
		requiresForgotPassword={true}
	/>
);
