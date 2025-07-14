import React from 'react';
import { OrdersList } from '@/components/order/order-list/order-list';
// import styles from './profile-orders.module.css';

// Mock user orders - would come from Redux/API later
const mockUserOrders = [
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
		_id: '4',
		ingredients: [
			'60d3463f7034a000269f45e7',
			'60d3463f7034a000269f45e9',
			'60d3463f7034a000269f45e8',
			'60d3463f7034a000269f45ea',
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
		status: 'created' as const,
		number: 34531,
		createdAt: '2024-01-15T14:30:00.000Z',
		updatedAt: '2024-01-15T14:30:00.000Z',
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

export const ProfileOrders = (): React.JSX.Element => {
	return (
		<div>
			<OrdersList
				orders={mockUserOrders}
				ingredients={mockIngredients}
				showStatus={true}
				linkTo='profile/orders'
			/>
		</div>
	);
};

// import { OrdersList } from '@/components/order/order-list/order-list';
// import React from 'react';

// export const ProfileOrders = (): React.JSX.Element => {
// 	return (
// 		<div>
// 			{/* <h2 className='text text_type_main-large'>История заказов</h2>
// 			<p className='text text_type_main-default mt-8'>
// 				Функциональность истории заказов будет реализована в следующем спринте
// 			</p> */}
// 			{/* OrderList of current user will be here*/}
// 		</div>
// 	);
// };
