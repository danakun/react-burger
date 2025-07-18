import React from 'react';
import { OrderCard } from '../order-card/order.card';
import { TOrderData, TIngredientData } from '../../../utils/types';
import styles from './order-list.module.css';

interface OrdersListProps {
	orders: TOrderData[];
	ingredients: TIngredientData[];
	showStatus?: boolean;
	linkTo: string;
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
