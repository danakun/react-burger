import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppHeader } from '@/components/app-header/app-header';
// @ts-expect-error "Ignore"
import { fetchIngredients } from '../../services/ingredientsSlice';
import { Home } from '../../pages/home/home';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { ProfileLayout } from '../../pages/profile/profile-layout';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile/profile-orders/profile-orders';
import { OrderDetails } from '../../pages/profile/order-details/order-details';
import { NotFound } from '../../pages/not-found/not-found';
import { IngredientPage as IngredientDetails } from '../../pages/ingredient/ingredient-page';
import { Modal } from '../modal/modal';
import {
	OnlyUnAuth,
	OnlyAuth,
	ResetPasswordProtected,
} from '../protected-route/protected-route';
// @ts-expect-error "Ignore"
import { checkUserAuth } from '../../services/actions';

export const App = (): React.JSX.Element => {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const background = location.state && location.state.background;

	const handleModalClose = () => {
		// go one route back when modal is closed
		navigate(-1);
	};

	useEffect(() => {
		dispatch(fetchIngredients());
		dispatch(checkUserAuth());
	}, [dispatch]);

	return (
		<>
			<AppHeader />
			<Routes location={background || location}>
				<Route path='/' element={<Home />} />

				<Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
				<Route
					path='/register'
					element={<OnlyUnAuth component={<Register />} />}
				/>
				<Route
					path='/forgot-password'
					element={<OnlyUnAuth component={<ForgotPassword />} />}
				/>
				<Route
					path='/reset-password'
					element={<ResetPasswordProtected component={<ResetPassword />} />}
				/>

				{/* Profile nested routes */}
				<Route
					path='/profile'
					element={<OnlyAuth component={<ProfileLayout />} />}>
					<Route index element={<Profile />} />
					<Route path='orders' element={<ProfileOrders />} />
					<Route path='orders/:number' element={<OrderDetails />} />
				</Route>

				<Route
					path='/ingredients/:ingredientId'
					element={<IngredientDetails />}
				/>
				<Route path='*' element={<NotFound />} />
			</Routes>

			{background && (
				<Routes>
					<Route
						path='/ingredients/:ingredientId'
						element={
							<Modal onClose={handleModalClose}>
								<IngredientDetails />
							</Modal>
						}
					/>
				</Routes>
			)}
		</>
	);
};
