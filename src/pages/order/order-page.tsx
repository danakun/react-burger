import React from 'react';
import { OrderDetails } from '../../components/order/order-info/order-info';
import styles from './order-page.module.css';

export const OrderPage: React.FC = () => {
	return (
		<div className={styles.orderSection}>
			<h1 className={`${styles.orderPageTitle} text text_type_main-large`}>
				Информация о заказе
			</h1>
			<OrderDetails />
		</div>
	);
};
