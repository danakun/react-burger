import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from '../../../services/store';
import { OrdersList } from '../../../components/order/order-list/order-list';
import { Preloader } from '../../../components/preloader/preloader';
import {
	userFeedConnect,
	userFeedDisconnect,
	getUserOrdersWsUrl,
} from '../../../services/user-feed/actions';
import {
	selectUserFeedOrders,
	selectUserFeedIsConnected,
	selectUserFeedIsConnecting,
	clearUserFeedError,
} from '../../../services/user-feed/userFeedSlice';
import { selectIngredients } from '../../../services/ingredientsSlice';
import { getUserData } from '../../../services/userSlice';
import styles from './profile-orders.module.css';

export const ProfileOrders: React.FC = () => {
	const dispatch = useDispatch();

	// Select data from Redux store
	const rawOrders = useSelector(selectUserFeedOrders);
	const isConnected = useSelector(selectUserFeedIsConnected);
	const isConnecting = useSelector(selectUserFeedIsConnecting);
	const ingredients = useSelector(selectIngredients);
	const user = useSelector(getUserData);

	// Sort orders
	const orders = useMemo(() => {
		return [...rawOrders].sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		);
	}, [rawOrders]);

	// Get token and auth status
	const accessToken = localStorage.getItem('accessToken');
	const isAuthenticated = !!user && !!accessToken;

	// Connect to WS - use working helper
	useEffect(() => {
		if (isAuthenticated && accessToken && !isConnected && !isConnecting) {
			try {
				const wsUrl = getUserOrdersWsUrl(accessToken);
				dispatch(userFeedConnect(wsUrl));
			} catch (error) {
				console.error('WebSocket connection error:', error);
			}
		}
	}, [dispatch, isAuthenticated, accessToken, isConnected, isConnecting]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			dispatch(userFeedDisconnect());
			dispatch(clearUserFeedError());
		};
	}, [dispatch]);

	if (
		!isAuthenticated ||
		!ingredients.length ||
		isConnecting ||
		(!isConnected && orders.length === 0)
	) {
		return (
			<div className={styles.container}>
				<Preloader />
			</div>
		);
	}

	// Show empty state if no orders and connected
	if (orders.length === 0 && isConnected) {
		return (
			<div className={styles.container}>
				<p className='text text_type_main-medium text_color_inactive'>
					У вас пока нет заказов
				</p>
			</div>
		);
	}

	// Show orders
	return (
		<div className={styles.container}>
			<OrdersList
				orders={orders}
				ingredients={ingredients}
				showStatus={true}
				linkTo='profile/orders'
			/>
		</div>
	);
};

// import React, { useEffect, useMemo } from 'react';
// import { useSelector, useDispatch } from '../../../services/store';
// import { OrdersList } from '../../../components/order/order-list/order-list';
// import { Preloader } from '../../../components/preloader/preloader';
// import {
// 	userFeedConnect,
// 	userFeedDisconnect,
// 	getUserOrdersWsUrl,
// } from '../../../services/user-feed/actions';
// import {
// 	selectUserFeedOrders,
// 	selectUserFeedIsConnected,
// 	selectUserFeedIsConnecting,
// 	clearUserFeedError,
// } from '../../../services/user-feed/userFeedSlice';
// import { selectIngredients } from '../../../services/ingredientsSlice';
// import { getUserData } from '../../../services/userSlice';
// import styles from './profile-orders.module.css';

// export const ProfileOrders: React.FC = () => {
// 	const dispatch = useDispatch();

// 	// Select data from Redux store
// 	const rawOrders = useSelector(selectUserFeedOrders);
// 	const isConnected = useSelector(selectUserFeedIsConnected);
// 	const isConnecting = useSelector(selectUserFeedIsConnecting);
// 	const ingredients = useSelector(selectIngredients);
// 	const user = useSelector(getUserData);

// 	// Sort orders
// 	const orders = useMemo(() => {
// 		return [...rawOrders].sort(
// 			(a, b) =>
// 				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
// 		);
// 	}, [rawOrders]);

// 	// Get token and auth status
// 	const accessToken = localStorage.getItem('accessToken');
// 	const isAuthenticated = !!user && !!accessToken;

// 	// Connect to WS
// 	// useEffect(() => {
// 	// 	if (isAuthenticated && accessToken && !isConnected && !isConnecting) {
// 	// 		try {
// 	// 			const wsUrl = getUserOrdersWsUrl(accessToken);
// 	// 			dispatch(userFeedConnect(wsUrl));
// 	// 		} catch (error) {
// 	// 			console.error('WebSocket connection error:', error);
// 	// 		}
// 	// 	}
// 	// }, [dispatch, isAuthenticated, accessToken, isConnected, isConnecting]);

// 	useEffect(() => {
// 		if (isAuthenticated && accessToken && !isConnected && !isConnecting) {
// 			try {
// 				// Try the old helper function approach
// 				const wsUrl = getUserOrdersWsUrl(accessToken);
// 				dispatch(userFeedConnect(wsUrl));
// 				console.log('Connecting to:', wsUrl);
// 			} catch (error) {
// 				console.error('WebSocket connection error:', error);
// 			}
// 		}
// 	}, [dispatch, isAuthenticated, accessToken, isConnected, isConnecting]);

// 	// Cleanup on unmount
// 	useEffect(() => {
// 		return () => {
// 			dispatch(userFeedDisconnect());
// 			dispatch(clearUserFeedError());
// 		};
// 	}, [dispatch]);

// 	// Show preloader while loading
// 	if (
// 		!isAuthenticated ||
// 		!ingredients.length ||
// 		isConnecting ||
// 		(!isConnected && orders.length === 0)
// 	) {
// 		return (
// 			<div className={styles.container}>
// 				<Preloader />
// 			</div>
// 		);
// 	}

// 	// Show empty state if no orders and connected
// 	if (orders.length === 0 && isConnected) {
// 		return (
// 			<div className={styles.container}>
// 				<p className='text text_type_main-medium text_color_inactive'>
// 					У вас пока нет заказов
// 				</p>
// 			</div>
// 		);
// 	}

// 	// Show orders
// 	return (
// 		<div className={styles.container}>
// 			<OrdersList
// 				orders={orders}
// 				ingredients={ingredients}
// 				showStatus={true}
// 				linkTo='profile/orders'
// 			/>
// 		</div>
// 	);
// };
