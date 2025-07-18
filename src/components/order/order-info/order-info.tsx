import React, { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../../services/store';
import {
	CurrencyIcon,
	FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { selectOrderByNumber } from '../../../services/all-feed/allFeedSlice';
import { selectUserFeedOrders } from '../../../services/user-feed/userFeedSlice';
import { selectIngredients } from '../../../services/ingredientsSlice';
import { getOrderByNumber } from '../../../services/orderSlice';
import { TOrderStatus, TIngredientData } from '../../../utils/types';
import { Preloader } from '../../../components/preloader/preloader';
import styles from './order-info.module.css';

const OrderDetails = (): React.JSX.Element => {
	const { number } = useParams<{ number: string }>();
	const location = useLocation();
	const dispatch = useDispatch();

	const ingredients = useSelector(selectIngredients);
	const orderNumber = number ? parseInt(number, 10) : 0;

	// Simple order selection logic like the example
	const order = useSelector((state) => {
		// Try allFeed
		let order = selectOrderByNumber(orderNumber)(state);
		if (order) return order;

		// Try userFeed
		const userOrders = selectUserFeedOrders(state);
		order = userOrders.find((o) => o.number === orderNumber);
		if (order) return order;

		// Fallback to orderSlice
		return state.order.order;
	});

	// Fetch from API if not found
	useEffect(() => {
		if (!order && orderNumber) {
			dispatch(getOrderByNumber(orderNumber));
		}
	}, [order, orderNumber, dispatch]);

	// check if modal
	const isModal = location.state && location.state.background;

	const orderIngredients = useMemo(() => {
		if (!order || !ingredients.length) return [];

		const ingredientCounts = order.ingredients.reduce(
			(acc, ingredientId) => {
				acc[ingredientId] = (acc[ingredientId] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const validIngredients: Array<TIngredientData & { count: number }> = [];

		Object.entries(ingredientCounts).forEach(([ingredientId, count]) => {
			const ingredient = ingredients.find((ing) => ing._id === ingredientId);
			if (ingredient) {
				validIngredients.push({
					...ingredient,
					count,
				});
			}
		});

		return validIngredients;
	}, [order, ingredients]);

	const totalPrice = useMemo(() => {
		if (!order || !ingredients.length) return 0;

		return order.ingredients.reduce((total, ingredientId) => {
			const ingredient = ingredients.find((ing) => ing._id === ingredientId);
			return total + (ingredient?.price || 0);
		}, 0);
	}, [order, ingredients]);

	const getStatusText = (status: TOrderStatus) => {
		switch (status) {
			case 'done':
				return 'Выполнен';
			case 'pending':
				return 'Готовится';
			case 'created':
				return 'Создан';
			default:
				return status;
		}
	};

	const getStatusColor = (status: TOrderStatus) => {
		switch (status) {
			case 'done':
				return '#00CCCC';
			case 'pending':
				return '#E52B1A';
			case 'created':
				return '#F2F2F3';
			default:
				return '#F2F2F3';
		}
	};

	// Simple loading state like the example
	if (!order) {
		return (
			<div className={styles.container}>
				<Preloader />
			</div>
		);
	}

	const orderName = order.name || 'Неизвестный бургер';

	return (
		<div
			className={`${styles.container} ${isModal ? styles.modal : styles.page}`}>
			<p
				className={`${isModal ? styles.orderNumberModal : styles.orderNumberPage} text text_type_digits-default mb-10`}>
				#{order.number}
			</p>

			<h2 className={`${styles.orderName} text text_type_main-medium mb-3`}>
				{orderName}
			</h2>

			<p
				className={`${styles.orderStatus} text text_type_main-default mb-15`}
				style={{ color: getStatusColor(order.status) }}>
				{getStatusText(order.status)}
			</p>

			<h3 className={'text text_type_main-medium mb-6'}>Состав:</h3>

			<div className={`${styles.ingredientsList} mb-10`}>
				{orderIngredients.map((ingredient) => (
					<div key={ingredient._id} className={`${styles.ingredientItem} mb-4`}>
						<div>
							<img
								src={ingredient.image}
								alt={ingredient.name}
								className={`${styles.ingredientImage}`}
							/>
						</div>
						<p
							className={`${styles.ingredientName} text text_type_main-default`}>
							{ingredient.name}
						</p>
						<div className={`${styles.ingredientPrice}`}>
							<span className='text text_type_digits-default mr-2'>
								{ingredient.count} x {ingredient.price}
							</span>
							<CurrencyIcon type='primary' />
						</div>
					</div>
				))}
			</div>

			<div className={`${styles.orderFooter}`}>
				<div
					className={`${styles.orderDate} text text_type_main-default text_color_inactive`}>
					<FormattedDate date={new Date(order.createdAt)} />
				</div>
				<div className={`${styles.totalPrice}`}>
					<span className='text text_type_digits-default mr-2'>
						{totalPrice}
					</span>
					<CurrencyIcon type='primary' />
				</div>
			</div>
		</div>
	);
};

export { OrderDetails };

// import React, { useMemo, useEffect, useRef } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from '../../../services/store';
// import {
// 	CurrencyIcon,
// 	FormattedDate,
// } from '@ya.praktikum/react-developer-burger-ui-components';
// import { selectOrderByNumber } from '../../../services/all-feed/allFeedSlice';
// import { selectUserFeedOrders } from '../../../services/user-feed/userFeedSlice';
// import { selectIngredients } from '../../../services/ingredientsSlice';
// import {
// 	getOrderByNumber,
// 	getOrder,
// 	getIsLoading,
// 	getHasError,
// } from '../../../services/orderSlice';
// import { TOrderStatus, TIngredientData } from '../../../utils/types';
// import { Preloader } from '../../../components/preloader/preloader';
// import styles from './order-info.module.css';

// const OrderDetails = (): React.JSX.Element => {
// 	const { number } = useParams<{ number: string }>();
// 	const location = useLocation();
// 	const dispatch = useDispatch();
// 	const apiAttempted = useRef(false);

// 	const ingredients = useSelector(selectIngredients);

// 	// Get order from all available slices
// 	const orderNumber = number ? parseInt(number, 10) : 0;

// 	const allFeedOrder = useSelector(selectOrderByNumber(orderNumber));

// 	const userFeedOrders = useSelector(selectUserFeedOrders);
// 	const userFeedOrder = useMemo(() => {
// 		return userFeedOrders.find((order) => order.number === orderNumber);
// 	}, [userFeedOrders, orderNumber]);

// 	const orderSliceOrder = useSelector(getOrder);
// 	const isLoadingOrder = useSelector(getIsLoading);
// 	const hasOrderError = useSelector(getHasError);

// 	const order = allFeedOrder || userFeedOrder || orderSliceOrder;

// 	const isModal = location.state && location.state.background;

// 	//  fallback
// 	useEffect(() => {
// 		if (
// 			orderNumber &&
// 			!allFeedOrder &&
// 			!userFeedOrder &&
// 			!orderSliceOrder &&
// 			!isLoadingOrder &&
// 			!apiAttempted.current
// 		) {
// 			apiAttempted.current = true;
// 			dispatch(getOrderByNumber(orderNumber));
// 		}
// 	}, [
// 		dispatch,
// 		orderNumber,
// 		allFeedOrder,
// 		userFeedOrder,
// 		orderSliceOrder,
// 		isLoadingOrder,
// 		isModal,
// 	]);

// 	useEffect(() => {
// 		apiAttempted.current = false;
// 	}, [orderNumber]);

// 	const orderIngredients = useMemo(() => {
// 		if (!order || !ingredients.length) return [];

// 		// Count ingredient occurrences
// 		const ingredientCounts = order.ingredients.reduce(
// 			(acc, ingredientId) => {
// 				acc[ingredientId] = (acc[ingredientId] || 0) + 1;
// 				return acc;
// 			},
// 			{} as Record<string, number>
// 		);

// 		const validIngredients: Array<TIngredientData & { count: number }> = [];

// 		Object.entries(ingredientCounts).forEach(([ingredientId, count]) => {
// 			const ingredient = ingredients.find((ing) => ing._id === ingredientId);
// 			if (ingredient) {
// 				validIngredients.push({
// 					...ingredient,
// 					count,
// 				});
// 			}
// 		});

// 		return validIngredients;
// 	}, [order, ingredients]);

// 	const totalPrice = useMemo(() => {
// 		if (!order || !ingredients.length) return 0;

// 		return order.ingredients.reduce((total, ingredientId) => {
// 			const ingredient = ingredients.find((ing) => ing._id === ingredientId);
// 			return total + (ingredient?.price || 0);
// 		}, 0);
// 	}, [order, ingredients]);

// 	const formatDate = (dateString: string) => {
// 		return new Date(dateString);
// 	};

// 	const getStatusText = (status: TOrderStatus) => {
// 		switch (status) {
// 			case 'done':
// 				return 'Выполнен';
// 			case 'pending':
// 				return 'Готовится';
// 			case 'created':
// 				return 'Создан';
// 			default:
// 				return status;
// 		}
// 	};

// 	const getStatusColor = (status: TOrderStatus) => {
// 		switch (status) {
// 			case 'done':
// 				return '#00CCCC';
// 			case 'pending':
// 				return '#E52B1A';
// 			case 'created':
// 				return '#F2F2F3';
// 			default:
// 				return '#F2F2F3';
// 		}
// 	};

// 	// backend name or fallback
// 	const orderName = order?.name || 'Неизвестный бургер';

// 	// Loading states
// 	if (!ingredients.length) {
// 		return (
// 			<div className={styles.container}>
// 				<p className='text text_type_main-medium'>Загрузка ингредиентов...</p>
// 				<Preloader />
// 			</div>
// 		);
// 	}

// 	if (isLoadingOrder) {
// 		return (
// 			<div className={styles.container}>
// 				<p className='text text_type_main-medium'>Загрузка заказа...</p>
// 				<Preloader />
// 			</div>
// 		);
// 	}

// 	if (!order) {
// 		return (
// 			<div className={styles.container}>
// 				<p className='text text_type_main-medium'>
// 					Заказ #{orderNumber} не найден
// 				</p>
// 				{hasOrderError && (
// 					<p className='text text_type_main-small text_color_inactive mt-2'>
// 						Ошибка: {hasOrderError}
// 					</p>
// 				)}
// 			</div>
// 		);
// 	}

// 	return (
// 		<div
// 			className={`${styles.container} ${isModal ? styles.modal : styles.page}`}>
// 			<p
// 				className={`${isModal ? styles.orderNumberModal : styles.orderNumberPage} text text_type_digits-default mb-10`}>
// 				#{order.number}
// 			</p>

// 			<h2 className={`${styles.orderName} text text_type_main-medium mb-3`}>
// 				{orderName}
// 			</h2>

// 			<p
// 				className={`${styles.orderStatus} text text_type_main-default mb-15`}
// 				style={{ color: getStatusColor(order.status) }}>
// 				{getStatusText(order.status)}
// 			</p>

// 			<h3 className={'text text_type_main-medium mb-6'}>Состав:</h3>

// 			<div className={`${styles.ingredientsList} mb-10`}>
// 				{orderIngredients.map((ingredient) => (
// 					<div key={ingredient._id} className={`${styles.ingredientItem} mb-4`}>
// 						<div>
// 							<img
// 								src={ingredient.image}
// 								alt={ingredient.name}
// 								className={`${styles.ingredientImage}`}
// 							/>
// 						</div>
// 						<p
// 							className={`${styles.ingredientName} text text_type_main-default`}>
// 							{ingredient.name}
// 						</p>
// 						<div className={`${styles.ingredientPrice}`}>
// 							<span className='text text_type_digits-default mr-2'>
// 								{ingredient.count} x {ingredient.price}
// 							</span>
// 							<CurrencyIcon type='primary' />
// 						</div>
// 					</div>
// 				))}
// 			</div>

// 			<div className={`${styles.orderFooter}`}>
// 				<div
// 					className={`${styles.orderDate} text text_type_main-default text_color_inactive`}>
// 					<FormattedDate date={formatDate(order.createdAt)} />
// 				</div>
// 				<div className={`${styles.totalPrice}`}>
// 					<span className='text text_type_digits-default mr-2'>
// 						{totalPrice}
// 					</span>
// 					<CurrencyIcon type='primary' />
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export { OrderDetails };
