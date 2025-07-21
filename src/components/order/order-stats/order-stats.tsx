import React, { useMemo } from 'react';
import styles from './order-stats.module.css';
import { TOrderData } from '../../../utils/types';

interface FeedStatisticsProps {
	orders: TOrderData[];
	total: number;
	totalToday: number;
}

// const OrderNumbersList: React.FC<{
// 	orders: TOrderData[]; // Changed from Order[] to TOrderData[]
// 	maxColumns?: number;
// 	itemsPerColumn?: number;
// }> = ({ orders, maxColumns = 2, itemsPerColumn = 5 }) => {
// 	const chunkedOrders = useMemo(() => {
// 		const chunks: TOrderData[][] = []; // Changed from Order[][] to TOrderData[][]

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

export const FeedStatistics = ({
	orders,
	total,
	totalToday,
}: FeedStatisticsProps) => {
	const { readyOrders, inProgressOrders } = useMemo(() => {
		const ready = orders.filter((order) => order.status === 'done');
		const inProgress = orders.filter(
			(order) => order.status === 'pending' || order.status === 'created'
		);

		return {
			readyOrders: ready,
			inProgressOrders: inProgress,
		};
	}, [orders]);

	return (
		<div className={`${styles.stats} pl-15`}>
			<div className={`${styles.statusBoards} mb-15`}>
				<div className={`${styles.readyOrders}`}>
					<h2 className='text text_type_main-medium mb-6'>Готовы:</h2>
					<div className={`${styles.orderNumbersContainer}`}>
						{readyOrders.slice(0, 10).map((order) => (
							<p
								key={order._id}
								className={`text text_type_digits-default ${styles.orderNumberMint}`}>
								{order.number}
							</p>
						))}
					</div>
				</div>

				<div className={`${styles.inProgressOrders}`}>
					<h2 className='text text_type_main-medium mb-6'>В работе:</h2>
					<div className={`${styles.orderNumbersContainer}`}>
						{inProgressOrders.slice(0, 10).map((order) => (
							<p
								key={order._id}
								className={`text text_type_digits-default ${styles.orderNumber}`}>
								{order.number}
							</p>
						))}
					</div>
				</div>
			</div>

			<div className={`${styles.totalStats}`}>
				<div className={`${styles.allTimeStats} mb-15`}>
					<h2 className='text text_type_main-medium'>
						Выполнено за все время:
					</h2>
					<p className={`text text_type_digits-large ${styles.totalNumber}`}>
						{total.toLocaleString()}
					</p>
				</div>

				<div className={`${styles.todayStats}`}>
					<h2 className='text text_type_main-medium'>Выполнено за сегодня:</h2>
					<p className={`text text_type_digits-large ${styles.totalNumber}`}>
						{totalToday}
					</p>
				</div>
			</div>
		</div>
	);
};
