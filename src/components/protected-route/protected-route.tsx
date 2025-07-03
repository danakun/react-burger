// components/protected-route/protected-route.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @ts-expect-error "Ignore"
import { getIsAuthChecked, getUserData } from '../../services/userSlice';
import { Preloader } from '@components/preloader/preloader.jsx';

type ProtectedRouteProps = {
	component: React.ReactNode;
	onlyUnAuth?: boolean;
	requiresForgotPassword?: boolean;
};

type WrapperComponentProps = {
	component: React.ReactNode;
};

export const ProtectedRoute = ({
	component,
	onlyUnAuth = false,
	requiresForgotPassword = false,
}: ProtectedRouteProps): React.ReactNode => {
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
export const OnlyAuth = ({
	component,
}: WrapperComponentProps): React.ReactNode => (
	<ProtectedRoute component={component} onlyUnAuth={false} />
);

export const OnlyUnAuth = ({
	component,
}: WrapperComponentProps): React.ReactNode => (
	<ProtectedRoute component={component} onlyUnAuth={true} />
);

export const ResetPasswordProtected = ({
	component,
}: WrapperComponentProps): React.ReactNode => (
	<ProtectedRoute
		component={component}
		onlyUnAuth={true}
		requiresForgotPassword={true}
	/>
);
