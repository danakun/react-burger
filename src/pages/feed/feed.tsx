// import React, { useMemo } from 'react';
import { OrdersList } from '../../components/order/order-list/order-list';
import { FeedStatistics } from '../../components/order/order-stats/order-stats';
import styles from './feed.module.css';

// Mock data that simulates the WebSocket response
const mockOrders = [
	{
		_id: '1',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
		],
		status: 'done' as const,
		number: 34535,
		createdAt: '2024-01-15T16:20:00.000Z',
		updatedAt: '2024-01-15T16:20:00.000Z',
	},
	{
		_id: '2',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
			'60d3463f7034a000269f45ea',
			'60d3463f7034a000269f45eb',
		],
		status: 'done' as const,
		number: 34534,
		createdAt: '2024-01-15T13:20:00.000Z',
		updatedAt: '2024-01-15T13:20:00.000Z',
	},
	{
		_id: '3',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
			'60d3463f7034a000269f45ea',
			'60d3463f7034a000269f45eb',
		],
		status: 'done' as const,
		number: 34533,
		createdAt: '2024-01-14T13:50:00.000Z',
		updatedAt: '2024-01-14T13:50:00.000Z',
	},
	{
		_id: '4',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
			'60d3463f7034a000269f45ea',
		],
		status: 'pending' as const,
		number: 34532,
		createdAt: '2024-01-13T21:53:00.000Z',
		updatedAt: '2024-01-13T21:53:00.000Z',
	},
	{
		_id: '5',
		ingredients: ['60d3463f7034a000269f45e7', '60d3463f7034a000269f45e9'],
		status: 'pending' as const,
		number: 34531,
		createdAt: '2024-01-15T14:30:00.000Z',
		updatedAt: '2024-01-15T14:30:00.000Z',
	},
	{
		_id: '6',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
		],
		status: 'created' as const,
		number: 34530,
		createdAt: '2024-01-15T15:45:00.000Z',
		updatedAt: '2024-01-15T15:45:00.000Z',
	},
];

// Mock ingredients data
const mockIngredients = [
	{
		_id: '60d3463f7034a000269f45e7',
		name: 'Fluorescent',
		price: 988,
		image: 'https://code.s3.yandex.net/react/code/bun-02.png',
		type: 'bun',
	},
	{
		_id: '60d3463f7034a000269f45e9',
		name: 'Meat of immortal mollusks',
		price: 1337,
		image: 'https://code.s3.yandex.net/react/code/meat-02.png',
		type: 'main',
	},
	{
		_id: '60d3463f7034a000269f45e8',
		name: 'Crystalline rings of Saturn',
		price: 6000,
		image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
		type: 'sauce',
	},
	{
		_id: '60d3463f7034a000269f45ea',
		name: 'Space sauce',
		price: 80,
		image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
		type: 'sauce',
	},
	{
		_id: '60d3463f7034a000269f45eb',
		name: 'Galactic cheese',
		price: 150,
		image: 'https://code.s3.yandex.net/react/code/cheese.png',
		type: 'main',
	},
	{
		_id: '60d3463f7034a000269f45ec',
		name: 'Space lettuce',
		price: 200,
		image: 'https://code.s3.yandex.net/react/code/salad.png',
		type: 'main',
	},
	{
		_id: '60d3463f7034a000269f45ed',
		name: 'Meteor cutlet',
		price: 3000,
		image: 'https://code.s3.yandex.net/react/code/meat-01.png',
		type: 'main',
	},
	{
		_id: '60d3463f7034a000269f45ee',
		name: 'Spicy alien sauce',
		price: 90,
		image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
		type: 'sauce',
	},
];

export const Feed: React.FC = () => {
	const orders = mockOrders;
	const ingredients = mockIngredients;
	const total = 28752;
	const totalToday = 138;

	return (
		<main className={styles.feed}>
			<div className={styles.title}>
				<h1 className='text text_type_main-large'>Лента заказов</h1>
			</div>

			<div className={`${styles.content} pl-5 pr-5`}>
				<OrdersList
					orders={orders}
					ingredients={ingredients}
					showStatus={false} // Hide status in feed
					linkTo='feed' // Links to /feed/:number
				/>

				<FeedStatistics orders={orders} total={total} totalToday={totalToday} />
			</div>
		</main>
	);
};

// import React, { useMemo } from 'react';
// import { OrdersList } from '../../components/order/order-list/order-list';
// import { FeedStatistics } from '../../components/order/order-stats/order-stats';
// import styles from './feed.module.css';

// // Mock data that simulates the WebSocket response
// const mockOrders = [
// 	{
// 		_id: '1',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 		],
// 		status: 'done' as const,
// 		number: 34535,
// 		createdAt: '2024-01-15T16:20:00.000Z',
// 		updatedAt: '2024-01-15T16:20:00.000Z',
// 	},
// 	{
// 		_id: '2',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 			'60d3463f7034a000269f45ea',
// 			'60d3463f7034a000269f45eb',
// 		],
// 		status: 'done' as const,
// 		number: 34534,
// 		createdAt: '2024-01-15T13:20:00.000Z',
// 		updatedAt: '2024-01-15T13:20:00.000Z',
// 	},
// 	{
// 		_id: '3',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 			'60d3463f7034a000269f45ea',
// 			'60d3463f7034a000269f45eb',
// 		],
// 		status: 'done' as const,
// 		number: 34533,
// 		createdAt: '2024-01-14T13:50:00.000Z',
// 		updatedAt: '2024-01-14T13:50:00.000Z',
// 	},
// 	{
// 		_id: '4',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 			'60d3463f7034a000269f45ea',
// 		],
// 		status: 'pending' as const,
// 		number: 34532,
// 		createdAt: '2024-01-13T21:53:00.000Z',
// 		updatedAt: '2024-01-13T21:53:00.000Z',
// 	},
// 	{
// 		_id: '5',
// 		ingredients: ['60d3463f7034a000269f45e7', '60d3463f7034a000269f45e9'],
// 		status: 'pending' as const,
// 		number: 34531,
// 		createdAt: '2024-01-15T14:30:00.000Z',
// 		updatedAt: '2024-01-15T14:30:00.000Z',
// 	},
// 	{
// 		_id: '6',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 		],
// 		status: 'created' as const,
// 		number: 34530,
// 		createdAt: '2024-01-15T15:45:00.000Z',
// 		updatedAt: '2024-01-15T15:45:00.000Z',
// 	},
// ];

// // Mock ingredients data
// const mockIngredients = [
// 	{
// 		_id: '60d3463f7034a000269f45e7',
// 		name: 'Fluorescent',
// 		price: 988,
// 		image: 'https://code.s3.yandex.net/react/code/bun-02.png',
// 		type: 'bun',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45e9',
// 		name: 'Meat of immortal mollusks',
// 		price: 1337,
// 		image: 'https://code.s3.yandex.net/react/code/meat-02.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45e8',
// 		name: 'Crystalline rings of Saturn',
// 		price: 6000,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
// 		type: 'sauce',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ea',
// 		name: 'Space sauce',
// 		price: 80,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
// 		type: 'sauce',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45eb',
// 		name: 'Galactic cheese',
// 		price: 150,
// 		image: 'https://code.s3.yandex.net/react/code/cheese.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ec',
// 		name: 'Space lettuce',
// 		price: 200,
// 		image: 'https://code.s3.yandex.net/react/code/salad.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ed',
// 		name: 'Meteor cutlet',
// 		price: 3000,
// 		image: 'https://code.s3.yandex.net/react/code/meat-01.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ee',
// 		name: 'Spicy alien sauce',
// 		price: 90,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
// 		type: 'sauce',
// 	},
// ];

// export const Feed: React.FC = () => {
// 	const orders = mockOrders;
// 	const ingredients = mockIngredients;
// 	const total = 28752;
// 	const totalToday = 138;

// 	return (
// 		<main className={styles.feed}>
// 			<div className={styles.title}>
// 				<h1 className='text text_type_main-large'>Лента заказов</h1>
// 			</div>

// 			<div className={`${styles.content} pl-5 pr-5`}>
// 				<OrdersList orders={orders} ingredients={ingredients} />

// 				<FeedStatistics orders={orders} total={total} totalToday={totalToday} />
// 			</div>
// 		</main>
// 	);
// };

// import React, { useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
// 	CurrencyIcon,
// 	FormattedDate,
// } from '@ya.praktikum/react-developer-burger-ui-components';
// import styles from './feed.module.css';

// // Mock data that simulates the WebSocket response
// const mockOrders = [
// 	{
// 		_id: '1',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 		],
// 		status: 'done' as const,
// 		number: 34535,
// 		createdAt: '2024-01-15T16:20:00.000Z',
// 		updatedAt: '2024-01-15T16:20:00.000Z',
// 	},
// 	{
// 		_id: '2',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 			'60d3463f7034a000269f45ea',
// 			'60d3463f7034a000269f45eb',
// 		],
// 		status: 'done' as const,
// 		number: 34534,
// 		createdAt: '2024-01-15T13:20:00.000Z',
// 		updatedAt: '2024-01-15T13:20:00.000Z',
// 	},
// 	{
// 		_id: '3',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 			'60d3463f7034a000269f45ea',
// 			'60d3463f7034a000269f45eb',
// 		],
// 		status: 'done' as const,
// 		number: 34533,
// 		createdAt: '2024-01-14T13:50:00.000Z',
// 		updatedAt: '2024-01-14T13:50:00.000Z',
// 	},
// 	{
// 		_id: '4',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 			'60d3463f7034a000269f45ea',
// 		],
// 		status: 'pending' as const,
// 		number: 34532,
// 		createdAt: '2024-01-13T21:53:00.000Z',
// 		updatedAt: '2024-01-13T21:53:00.000Z',
// 	},
// 	{
// 		_id: '5',
// 		ingredients: ['60d3463f7034a000269f45e7', '60d3463f7034a000269f45e9'],
// 		status: 'pending' as const,
// 		number: 34531,
// 		createdAt: '2024-01-15T14:30:00.000Z',
// 		updatedAt: '2024-01-15T14:30:00.000Z',
// 	},
// 	{
// 		_id: '6',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 		],
// 		status: 'created' as const,
// 		number: 34530,
// 		createdAt: '2024-01-15T15:45:00.000Z',
// 		updatedAt: '2024-01-15T15:45:00.000Z',
// 	},
// ];

// // Mock ingredients data
// const mockIngredients = [
// 	{
// 		_id: '60d3463f7034a000269f45e7',
// 		name: 'Fluorescent',
// 		price: 988,
// 		image: 'https://code.s3.yandex.net/react/code/bun-02.png',
// 		type: 'bun',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45e9',
// 		name: 'Meat of immortal mollusks',
// 		price: 1337,
// 		image: 'https://code.s3.yandex.net/react/code/meat-02.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45e8',
// 		name: 'Crystalline rings of Saturn',
// 		price: 6000,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
// 		type: 'sauce',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ea',
// 		name: 'Space sauce',
// 		price: 80,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
// 		type: 'sauce',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45eb',
// 		name: 'Galactic cheese',
// 		price: 150,
// 		image: 'https://code.s3.yandex.net/react/code/cheese.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ec',
// 		name: 'Space lettuce',
// 		price: 200,
// 		image: 'https://code.s3.yandex.net/react/code/salad.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ed',
// 		name: 'Meteor cutlet',
// 		price: 3000,
// 		image: 'https://code.s3.yandex.net/react/code/meat-01.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ee',
// 		name: 'Spicy alien sauce',
// 		price: 90,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
// 		type: 'sauce',
// 	},
// ];

// interface Order {
// 	_id: string;
// 	ingredients: string[];
// 	status: 'created' | 'pending' | 'done';
// 	number: number;
// 	createdAt: string;
// 	updatedAt: string;
// }

// const OrderCard: React.FC<{ order: Order; ingredients: any[] }> = ({
// 	order,
// 	ingredients,
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
// 		navigate(`/feed/${order.number}`, {
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

// 			<p
// 				className={`${styles.orderStatus} text text_type_main-default mb-6`}
// 				style={{ color: getStatusColor(order.status) }}>
// 				{getStatusText(order.status)}
// 			</p>

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

// const OrderNumbersList: React.FC<{
// 	orders: Order[];
// 	maxColumns?: number;
// 	itemsPerColumn?: number;
// }> = ({ orders, maxColumns = 2, itemsPerColumn = 5 }) => {
// 	const chunkedOrders = useMemo(() => {
// 		const chunks: Order[][] = [];

// 		for (let i = 0; i < orders.length; i += itemsPerColumn) {
// 			chunks.push(orders.slice(i, i + itemsPerColumn));
// 			if (chunks.length >= maxColumns) break;
// 		}

// 		return chunks;
// 	}, [orders, maxColumns, itemsPerColumn]);

// 	return (
// 		<div className={`${styles.orderNumbersContainer}`}>
// 			{chunkedOrders.map((chunk, columnIndex) => (
// 				<div key={columnIndex} className={`${styles.orderNumbersColumn}`}>
// 					{chunk.map((order) => (
// 						<p
// 							key={order._id}
// 							className={`text text_type_digits-default ${styles.orderNumber}`}>
// 							{order.number}
// 						</p>
// 					))}
// 				</div>
// 			))}
// 		</div>
// 	);
// };

// export const Feed: React.FC = () => {
// 	const orders = mockOrders;
// 	const ingredients = mockIngredients;
// 	const total = 28752;
// 	const totalToday = 138;

// 	const { readyOrders, inProgressOrders } = useMemo(() => {
// 		const ready = orders.filter((order) => order.status === 'done');
// 		const inProgress = orders.filter(
// 			(order) => order.status === 'pending' || order.status === 'created'
// 		);

// 		return {
// 			readyOrders: ready,
// 			inProgressOrders: inProgress,
// 		};
// 	}, [orders]);

// 	return (
// 		<main className={styles.feed}>
// 			<h1 className={`${styles.title} text text_type_main-large mt-10 mb-5`}>
// 				Лента заказов
// 			</h1>

// 			<div className={`${styles.content} pl-5 pr-5`}>
// 				<div className={`${styles.ordersList}`}>
// 					{orders.map((order) => (
// 						<OrderCard
// 							key={order._id}
// 							order={order}
// 							ingredients={ingredients}
// 						/>
// 					))}
// 				</div>

// 				<div className={`${styles.stats} pl-15`}>
// 					<div className={`${styles.statusBoards} mb-15`}>
// 						<div className={`${styles.readyOrders}`}>
// 							<h2 className='text text_type_main-medium mb-6'>Готовы:</h2>
// 							<div className={`${styles.orderNumbersContainer}`}>
// 								{readyOrders.map((order) => (
// 									<p
// 										key={order._id}
// 										className={`text text_type_digits-default ${styles.orderNumberMint}`}>
// 										{order.number}
// 									</p>
// 								))}
// 							</div>
// 						</div>

// 						<div className={`${styles.inProgressOrders}`}>
// 							<h2 className='text text_type_main-medium mb-6'>В работе:</h2>
// 							<div className={`${styles.orderNumbersContainer}`}>
// 								{inProgressOrders.map((order) => (
// 									<p
// 										key={order._id}
// 										className={`text text_type_digits-default ${styles.orderNumber}`}>
// 										{order.number}
// 									</p>
// 								))}
// 							</div>
// 						</div>
// 					</div>

// 					<div className={`${styles.totalStats}`}>
// 						<div className={`${styles.allTimeStats} mb-15`}>
// 							<h2 className='text text_type_main-medium'>
// 								Выполнено за все время:
// 							</h2>
// 							<p
// 								className={`text text_type_digits-large ${styles.totalNumber}`}>
// 								{total.toLocaleString()}
// 							</p>
// 						</div>

// 						<div className={`${styles.todayStats}`}>
// 							<h2 className='text text_type_main-medium'>
// 								Выполнено за сегодня:
// 							</h2>
// 							<p
// 								className={`text text_type_digits-large ${styles.totalNumber}`}>
// 								{totalToday}
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</main>
// 	);
// };
