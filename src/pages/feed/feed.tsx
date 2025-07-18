import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrdersList } from '../../components/order/order-list/order-list';
import { FeedStatistics } from '../../components/order/order-stats/order-stats';
import { Preloader } from '../../components/preloader/preloader';
import {
	allFeedConnect,
	allFeedDisconnect,
} from '../../services/all-feed/actions';
import {
	selectAllFeedOrders,
	selectAllFeedTotal,
	selectAllFeedTotalToday,
	selectAllFeedIsConnected,
	selectAllFeedIsConnecting,
	selectAllFeedError,
} from '../../services/all-feed/allFeedSlice';
import { selectIngredients } from '../../services/ingredientsSlice';
import { ALL_ORDERS_WS_URL } from '../../utils/constants';
import styles from './feed.module.css';

export const Feed = (): React.JSX.Element => {
	const dispatch = useDispatch();

	// Select data from Redux store
	const orders = useSelector(selectAllFeedOrders);
	const total = useSelector(selectAllFeedTotal);
	const totalToday = useSelector(selectAllFeedTotalToday);
	const isConnected = useSelector(selectAllFeedIsConnected);
	const isConnecting = useSelector(selectAllFeedIsConnecting);
	const error = useSelector(selectAllFeedError);
	const ingredients = useSelector(selectIngredients);

	useEffect(() => {
		dispatch(allFeedConnect(ALL_ORDERS_WS_URL));

		return () => {
			dispatch(allFeedDisconnect());
		};
	}, [dispatch]);

	if (isConnecting || (!isConnected && orders.length === 0)) {
		return (
			<main className={styles.feed}>
				<div className={styles.title}>
					<h1 className='text text_type_main-large'>Лента заказов</h1>
				</div>
				<div className={`${styles.content} pl-5 pr-5 pb-10`}>
					<Preloader />
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className={styles.feed}>
				<div className={styles.title}>
					<h1 className='text text_type_main-large'>Лента заказов</h1>
				</div>
				<div className={`${styles.content} pl-5 pr-5`}>
					<p className='text text_type_main-medium text_color_error'>
						Ошибка загрузки ленты заказов: {error}
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className={styles.feed}>
			<div className={styles.title}>
				<h1 className='text text_type_main-large'>Лента заказов</h1>
			</div>

			<div className={`${styles.content} pl-5 pr-5`}>
				<OrdersList
					orders={orders}
					ingredients={ingredients}
					showStatus={false}
					linkTo='feed'
				/>

				<FeedStatistics orders={orders} total={total} totalToday={totalToday} />
			</div>
		</main>
	);
};
