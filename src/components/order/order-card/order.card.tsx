import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	CurrencyIcon,
	FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-card.module.css';

interface Order {
	_id: string;
	ingredients: string[];
	status: 'created' | 'pending' | 'done';
	number: number;
	createdAt: string;
	updatedAt: string;
}

interface Ingredient {
	_id: string;
	name: string;
	price: number;
	image: string;
	type: string;
}

interface OrderCardProps {
	order: Order;
	ingredients: Ingredient[];
	showStatus?: boolean;
	linkTo: string; // e.g., "feed" or "profile/orders"
}

export const OrderCard: React.FC<OrderCardProps> = ({
	order,
	ingredients,
	showStatus = false,
	linkTo,
}) => {
	const location = useLocation();

	const formatTime = (dateString: string) => {
		return new Date(dateString);
	};

	const getOrderName = (ingredientIds: string[]) => {
		const ingredientNames = ingredientIds
			.map((id) => ingredients.find((ing) => ing._id === id)?.name)
			.filter(Boolean);

		if (ingredientNames.length === 0) return 'Неизвестный бургер';

		return ingredientNames.join(' ') + ' бургер';
	};

	const calculatePrice = (ingredientIds: string[]) => {
		return ingredientIds.reduce((total, id) => {
			const ingredient = ingredients.find((ing) => ing._id === id);
			return total + (ingredient?.price || 0);
		}, 0);
	};

	const getIngredientImages = (ingredientIds: string[]) => {
		return ingredientIds.map((id) => {
			const ingredient = ingredients.find((ing) => ing._id === id);
			return ingredient?.image || '';
		});
	};

	const getStatusText = (status: string) => {
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

	const getStatusColor = (status: string) => {
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

	const ingredientImages = getIngredientImages(order.ingredients);
	const price = calculatePrice(order.ingredients);
	const orderName = getOrderName(order.ingredients);

	return (
		<Link
			to={`/${linkTo}/${order.number}`}
			state={{ background: location }}
			className={styles.link}>
			<div className={`${styles.orderCard} p-6 mb-4`}>
				<div className={`${styles.orderHeader} mb-6`}>
					<p className='text text_type_digits-default'>#{order.number}</p>
					<div className='text text_type_main-default text_color_inactive'>
						<FormattedDate date={formatTime(order.createdAt)} />
					</div>
				</div>

				<h3 className={`${styles.orderName} text text_type_main-medium mb-2`}>
					{orderName}
				</h3>

				{showStatus && (
					<p
						className={`${styles.orderStatus} text text_type_main-default mb-6`}
						style={{ color: getStatusColor(order.status) }}>
						{getStatusText(order.status)}
					</p>
				)}

				<div className={`${styles.orderFooter}`}>
					<div className={`${styles.ingredients}`}>
						{ingredientImages
							.slice(0, Math.min(6, order.ingredients.length))
							.map((image, index) => (
								<div key={index} className={`${styles.ingredientIcon}`}>
									<img
										src={image}
										alt='ingredient'
										className={`${styles.ingredientImage} ${
											index === 5 && order.ingredients.length > 6
												? styles.lastIngredientImage
												: ''
										}`}
									/>
									{index === 5 && order.ingredients.length > 6 && (
										<div className={`${styles.ingredientOverlay}`}>
											<span className='text text_type_main-default'>
												+{order.ingredients.length - 6}
											</span>
										</div>
									)}
								</div>
							))}
					</div>

					<div className={`${styles.price}`}>
						<span className='text text_type_digits-default mr-2'>{price}</span>
						<CurrencyIcon type='primary' />
					</div>
				</div>
			</div>
		</Link>
	);
};
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
// 	CurrencyIcon,
// 	FormattedDate,
// } from '@ya.praktikum/react-developer-burger-ui-components';
// import styles from './order-card.module.css';

// interface Order {
// 	_id: string;
// 	ingredients: string[];
// 	status: 'created' | 'pending' | 'done';
// 	number: number;
// 	createdAt: string;
// 	updatedAt: string;
// }

// interface Ingredient {
// 	_id: string;
// 	name: string;
// 	price: number;
// 	image: string;
// 	type: string;
// }

// interface OrderCardProps {
// 	order: Order;
// 	ingredients: Ingredient[];
// 	showStatus?: boolean;
// 	baseRoute?: 'feed' | 'profile/orders';
// }

// export const OrderCard: React.FC<OrderCardProps> = ({
// 	order,
// 	ingredients,
// 	showStatus = false,
// 	baseRoute = 'feed',
// }) => {
// 	const navigate = useNavigate();
// 	const location = useLocation();

// 	const formatTime = (dateString: string) => {
// 		return new Date(dateString);
// 	};

// 	const getOrderName = (ingredientIds: string[]) => {
// 		const ingredientNames = ingredientIds
// 			.map((id) => ingredients.find((ing) => ing._id === id)?.name)
// 			.filter(Boolean);

// 		if (ingredientNames.length === 0) return 'Неизвестный бургер';

// 		return ingredientNames.join(' ') + ' бургер';
// 	};

// 	const calculatePrice = (ingredientIds: string[]) => {
// 		return ingredientIds.reduce((total, id) => {
// 			const ingredient = ingredients.find((ing) => ing._id === id);
// 			return total + (ingredient?.price || 0);
// 		}, 0);
// 	};

// 	const getIngredientImages = (ingredientIds: string[]) => {
// 		return ingredientIds.map((id) => {
// 			const ingredient = ingredients.find((ing) => ing._id === id);
// 			return ingredient?.image || '';
// 		});
// 	};

// 	const getStatusText = (status: string) => {
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

// 	const getStatusColor = (status: string) => {
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

// 	const handleOrderClick = () => {
// 		const route =
// 			baseRoute === 'feed'
// 				? `/feed/${order.number}`
// 				: `/profile/orders/${order.number}`;
// 		navigate(route, {
// 			state: { background: location },
// 		});
// 	};

// 	const ingredientImages = getIngredientImages(order.ingredients);
// 	const price = calculatePrice(order.ingredients);
// 	const orderName = getOrderName(order.ingredients);

// 	return (
// 		<div className={`${styles.orderCard} p-6 mb-4`} onClick={handleOrderClick}>
// 			<div className={`${styles.orderHeader} mb-6`}>
// 				<p className='text text_type_digits-default'>#{order.number}</p>
// 				<div className='text text_type_main-default text_color_inactive'>
// 					<FormattedDate date={formatTime(order.createdAt)} />
// 				</div>
// 			</div>

// 			<h3 className={`${styles.orderName} text text_type_main-medium mb-2`}>
// 				{orderName}
// 			</h3>

// 			{showStatus && (
// 				<p
// 					className={`${styles.orderStatus} text text_type_main-default mb-6`}
// 					style={{ color: getStatusColor(order.status) }}>
// 					{getStatusText(order.status)}
// 				</p>
// 			)}

// 			<div className={`${styles.orderFooter}`}>
// 				<div className={`${styles.ingredients}`}>
// 					{ingredientImages
// 						.slice(0, Math.min(6, order.ingredients.length))
// 						.map((image, index) => (
// 							<div key={index} className={`${styles.ingredientIcon}`}>
// 								<img
// 									src={image}
// 									alt='ingredient'
// 									className={`${styles.ingredientImage} ${
// 										index === 5 && order.ingredients.length > 6
// 											? styles.lastIngredientImage
// 											: ''
// 									}`}
// 								/>
// 								{index === 5 && order.ingredients.length > 6 && (
// 									<div className={`${styles.ingredientOverlay}`}>
// 										<span className='text text_type_main-default'>
// 											+{order.ingredients.length - 6}
// 										</span>
// 									</div>
// 								)}
// 							</div>
// 						))}
// 				</div>

// 				<div className={`${styles.price}`}>
// 					<span className='text text_type_digits-default mr-2'>{price}</span>
// 					<CurrencyIcon type='primary' />
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
