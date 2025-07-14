import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
	CurrencyIcon,
	FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-info.module.css';

// Mock data - same as in Feed component
const mockOrders = [
	{
		_id: '1',
		number: 34535,
		name: 'Death Star Starship Main бургер',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
		],
		status: 'done',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		_id: '3',
		number: 34533,
		name: 'Black Hole Singularity острый бургер',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
			'60d3463f7034a000269f45ea',
			'60d3463f7034a000269f45eb',
			'60d3463f7034a000269f45ec',
			'60d3463f7034a000269f45ed',
			'60d3463f7034a000269f45ee',
		],
		status: 'done',
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
	},
];

const mockIngredients = [
	{
		_id: '60d3463f7034a000269f45e7',
		name: 'Флуоресцентная булка R2-D3',
		price: 988,
		image: 'https://code.s3.yandex.net/react/code/bun-02.png',
		type: 'bun',
	},
	{
		_id: '60d3463f7034a000269f45e9',
		name: 'Мясо бессмертных моллюсков Protozoaires',
		price: 1337,
		image: 'https://code.s3.yandex.net/react/code/meat-02.png',
		type: 'main',
	},
	{
		_id: '60d3463f7034a000269f45e8',
		name: 'Кристаллы марсианских альфа-сахаридов',
		price: 762,
		image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
		type: 'sauce',
	},
	{
		_id: '60d3463f7034a000269f45ea',
		name: 'Соус традиционный галактический',
		price: 15,
		image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
		type: 'sauce',
	},
	{
		_id: '60d3463f7034a000269f45eb',
		name: 'Сыр с астероидной плесенью',
		price: 4142,
		image: 'https://code.s3.yandex.net/react/code/cheese.png',
		type: 'main',
	},
	{
		_id: '60d3463f7034a000269f45ec',
		name: 'Соус фирменный Space Sauce',
		price: 80,
		image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
		type: 'sauce',
	},
	{
		_id: '60d3463f7034a000269f45ed',
		name: 'Говядина метеоритная',
		price: 3000,
		image: 'https://code.s3.yandex.net/react/code/meat-01.png',
		type: 'main',
	},
	{
		_id: '60d3463f7034a000269f45ee',
		name: 'Плоды Фалленианского дерева',
		price: 874,
		image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
		type: 'sauce',
	},
];

export const OrderDetails: React.FC = () => {
	const { number } = useParams<{ number: string }>();
	const location = useLocation();

	// Check if we're in a modal context
	const isModal = location.state && location.state.background;

	const order = useMemo(() => {
		return mockOrders.find((order) => order.number.toString() === number);
	}, [number]);

	const orderIngredients = useMemo(() => {
		if (!order) return [];

		// Count ingredient occurrences
		const ingredientCounts = order.ingredients.reduce(
			(acc, ingredientId) => {
				acc[ingredientId] = (acc[ingredientId] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		// Get unique ingredients with their details and counts
		return Object.entries(ingredientCounts)
			.map(([ingredientId, count]) => {
				const ingredient = mockIngredients.find(
					(ing) => ing._id === ingredientId
				);
				return {
					...ingredient,
					count,
				};
			})
			.filter(Boolean);
	}, [order]);

	const totalPrice = useMemo(() => {
		return (
			order?.ingredients.reduce((total, ingredientId) => {
				const ingredient = mockIngredients.find(
					(ing) => ing._id === ingredientId
				);
				return total + (ingredient?.price || 0);
			}, 0) || 0
		);
	}, [order]);

	const formatDate = (dateString: string) => {
		return new Date(dateString);
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

	if (!order) {
		return (
			<div className={styles.container}>
				<p className='text text_type_main-medium'>Заказ не найден</p>
			</div>
		);
	}

	return (
		<div
			className={`${styles.container} ${isModal ? styles.modal : styles.page}`}>
			<p
				className={`${isModal ? styles.orderNumberModal : styles.orderNumberPage} text text_type_digits-default mb-10`}>
				#{order.number}
			</p>

			<h2 className={`${styles.orderName} text text_type_main-medium mb-3`}>
				{order.name}
			</h2>

			<p className={`${styles.orderStatus} text text_type_main-default mb-15`}>
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
					<FormattedDate date={formatDate(order.createdAt)} />
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

// import React, { useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import {
// 	CurrencyIcon,
// 	FormattedDate,
// } from '@ya.praktikum/react-developer-burger-ui-components';
// import styles from './order-info.module.css';

// // Mock data - same as in Feed component
// const mockOrders = [
// 	{
// 		_id: '1',
// 		number: 34535,
// 		name: 'Death Star Starship Main бургер',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 		],
// 		status: 'done',
// 		createdAt: new Date().toISOString(),
// 		updatedAt: new Date().toISOString(),
// 	},
// 	{
// 		_id: '3',
// 		number: 34533,
// 		name: 'Black Hole Singularity острый бургер',
// 		ingredients: [
// 			'60d3463f7034a000269f45e7',
// 			'60d3463f7034a000269f45e9',
// 			'60d3463f7034a000269f45e8',
// 			'60d3463f7034a000269f45ea',
// 			'60d3463f7034a000269f45eb',
// 			'60d3463f7034a000269f45ec',
// 			'60d3463f7034a000269f45ed',
// 			'60d3463f7034a000269f45ee',
// 		],
// 		status: 'done',
// 		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
// 		updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
// 	},
// 	// Add other orders as needed
// ];

// const mockIngredients = [
// 	{
// 		_id: '60d3463f7034a000269f45e7',
// 		name: 'Флуоресцентная булка R2-D3',
// 		price: 988,
// 		image: 'https://code.s3.yandex.net/react/code/bun-02.png',
// 		type: 'bun',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45e9',
// 		name: 'Мясо бессмертных моллюсков Protozoaires',
// 		price: 1337,
// 		image: 'https://code.s3.yandex.net/react/code/meat-02.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45e8',
// 		name: 'Кристаллы марсианских альфа-сахаридов',
// 		price: 762,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
// 		type: 'sauce',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ea',
// 		name: 'Соус традиционный галактический',
// 		price: 15,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
// 		type: 'sauce',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45eb',
// 		name: 'Сыр с астероидной плесенью',
// 		price: 4142,
// 		image: 'https://code.s3.yandex.net/react/code/cheese.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ec',
// 		name: 'Соус фирменный Space Sauce',
// 		price: 80,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
// 		type: 'sauce',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ed',
// 		name: 'Говядина метеоритная',
// 		price: 3000,
// 		image: 'https://code.s3.yandex.net/react/code/meat-01.png',
// 		type: 'main',
// 	},
// 	{
// 		_id: '60d3463f7034a000269f45ee',
// 		name: 'Плоды Фалленианского дерева',
// 		price: 874,
// 		image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
// 		type: 'sauce',
// 	},
// ];

// interface OrderDetailsProps {
// 	isModal?: boolean;
// }

// export const OrderDetails: React.FC<OrderDetailsProps> = ({
// 	isModal = false,
// }) => {
// 	const { number } = useParams<{ number: string }>();

// 	const order = useMemo(() => {
// 		return mockOrders.find((order) => order.number.toString() === number);
// 	}, [number]);

// 	const orderIngredients = useMemo(() => {
// 		if (!order) return [];

// 		// Count ingredient occurrences
// 		const ingredientCounts = order.ingredients.reduce(
// 			(acc, ingredientId) => {
// 				acc[ingredientId] = (acc[ingredientId] || 0) + 1;
// 				return acc;
// 			},
// 			{} as Record<string, number>
// 		);

// 		// Get unique ingredients with their details and counts
// 		return Object.entries(ingredientCounts)
// 			.map(([ingredientId, count]) => {
// 				const ingredient = mockIngredients.find(
// 					(ing) => ing._id === ingredientId
// 				);
// 				return {
// 					...ingredient,
// 					count,
// 				};
// 			})
// 			.filter(Boolean);
// 	}, [order]);

// 	const totalPrice = useMemo(() => {
// 		return (
// 			order?.ingredients.reduce((total, ingredientId) => {
// 				const ingredient = mockIngredients.find(
// 					(ing) => ing._id === ingredientId
// 				);
// 				return total + (ingredient?.price || 0);
// 			}, 0) || 0
// 		);
// 	}, [order]);

// 	const formatDate = (dateString: string) => {
// 		return new Date(dateString);
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

// 	if (!order) {
// 		return (
// 			<div
// 				className={`${styles.container} ${isModal ? styles.modal : styles.page}`}>
// 				<p className='text text_type_main-medium'>Заказ не найден</p>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div
// 			className={`${styles.container} ${isModal ? styles.modal : styles.page}`}>
// 			{!isModal && (
// 				<h1 className={`${styles.pageTitle} text text_type_main-large mb-10`}>
// 					Информация о заказе
// 				</h1>
// 			)}

// 			<div className={`${styles.content}`}>
// 				<p
// 					className={`${styles.orderNumber} text text_type_digits-default mb-10`}>
// 					#{order.number}
// 				</p>

// 				<h2 className={`${styles.orderName} text text_type_main-medium mb-3`}>
// 					{order.name}
// 				</h2>

// 				<p
// 					className={`${styles.orderStatus} text text_type_main-default mb-15`}>
// 					{getStatusText(order.status)}
// 				</p>

// 				<h3 className={'text text_type_main-medium mb-6'}>Состав:</h3>

// 				<div className={`${styles.ingredientsList} mb-10`}>
// 					{orderIngredients.map((ingredient) => (
// 						<div
// 							key={ingredient._id}
// 							className={`${styles.ingredientItem} mb-4`}>
// 							<div>
// 								<img
// 									src={ingredient.image}
// 									alt={ingredient.name}
// 									className={`${styles.ingredientImage}`}
// 								/>
// 							</div>
// 							<p
// 								className={`${styles.ingredientName} text text_type_main-default`}>
// 								{ingredient.name}
// 							</p>
// 							<div className={`${styles.ingredientPrice}`}>
// 								<span className='text text_type_digits-default mr-2'>
// 									{ingredient.count} x {ingredient.price}
// 								</span>
// 								<CurrencyIcon type='primary' />
// 							</div>
// 						</div>
// 					))}
// 				</div>

// 				<div className={`${styles.orderFooter}`}>
// 					<div
// 						className={`${styles.orderDate} text text_type_main-default text_color_inactive`}>
// 						<FormattedDate date={formatDate(order.createdAt)} />
// 					</div>
// 					<div className={`${styles.totalPrice}`}>
// 						<span className='text text_type_digits-default mr-2'>
// 							{totalPrice}
// 						</span>
// 						<CurrencyIcon type='primary' />
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
