import React from 'react';
import { OrderCard } from '../order-card/order.card';
import styles from './order-list.module.css';

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

interface OrdersListProps {
	orders: Order[];
	ingredients: Ingredient[];
	showStatus?: boolean;
	linkTo: string; // "feed" or "profile/orders"
}

export const OrdersList: React.FC<OrdersListProps> = ({
	orders,
	ingredients,
	showStatus = false,
	linkTo,
}) => {
	return (
		<div className={`${styles.ordersList}`}>
			{orders.map((order) => (
				<OrderCard
					key={order._id}
					order={order}
					ingredients={ingredients}
					showStatus={showStatus}
					linkTo={linkTo}
				/>
			))}
		</div>
	);
};
