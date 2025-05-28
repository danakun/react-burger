import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './burger-constructor.module.css';

import {
	CurrencyIcon,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { BunItem } from './bun-item/bun-item';
import { FillingItem } from './filling-item/filling-item';
import { Modal } from '../modal/modal';
import { OrderDetails } from './order-details/order-details';
import { createOrder, clearOrder } from '../../services/orderSlice';

export const BurgerConstructor = () => {
	const dispatch = useDispatch();

	// Get constructor ingredients from Redux state
	const { bun, ingredients: fillings } = useSelector(
		(state) => state.burgerConstructor
	);

	// Get order state from Redux
	const {
		order,
		isLoading: isOrderLoading,
		hasError: hasOrderError,
	} = useSelector((state) => state.order);

	// Calculate total price from constructor ingredients
	const totalPrice = useMemo(() => {
		let price = 0;

		// Add bun price (x2 for top and bottom)
		if (bun) {
			price += bun.price * 2;
		}

		// Add fillings price
		fillings.forEach((item) => {
			price += item.price;
		});

		return price;
	}, [bun, fillings]);

	const handleOrderClick = async () => {
		if (!bun || fillings.length === 0) return;

		// Prepare ingredient IDs for API call
		const ingredientIds = [
			bun._id, // Top bun
			...fillings.map((item) => item._id), // All fillings
			bun._id, // Bottom bun
		];

		// Dispatch createOrder thunk
		dispatch(createOrder(ingredientIds));
	};

	const handleCloseModal = () => {
		dispatch(clearOrder());
	};

	const canPlaceOrder = bun && fillings.length > 0 && !isOrderLoading;

	return (
		<section className={styles.burger_constructor}>
			<div className={styles.burger_components}>
				{/* Top Bun */}
				{bun ? (
					<BunItem bun={bun} type='top' isLocked={true} />
				) : (
					<div className={`${styles.empty_bun} ${styles.empty_bun_top}`}>
						<p className='text text_type_main-default text_color_inactive'>
							Выберите булки
						</p>
					</div>
				)}

				{/* Fillings */}
				<ul className={`${styles.fillings_list} custom-scroll`}>
					{fillings.length > 0 ? (
						fillings.map((item, index) => (
							<FillingItem
								key={item.constructorId} // Use constructorId for unique keys
								filling={item}
								index={index}
								isDraggable={true}
							/>
						))
					) : (
						<div className={styles.empty_fillings}>
							<p className='text text_type_main-default text_color_inactive'>
								Выберите начинку
							</p>
						</div>
					)}
				</ul>

				{/* Bottom Bun */}
				{bun ? (
					<BunItem bun={bun} type='bottom' isLocked={true} />
				) : (
					<div className={`${styles.empty_bun} ${styles.empty_bun_bottom}`}>
						<p className='text text_type_main-default text_color_inactive'>
							Выберите булки
						</p>
					</div>
				)}
			</div>

			<div className={`${styles.order_details} mt-10`}>
				<div className={styles.total_price}>
					<span className='text text_type_digits-medium'>{totalPrice}</span>
					<CurrencyIcon type='primary' />
				</div>
				<Button
					type='primary'
					size='large'
					htmlType='button'
					onClick={handleOrderClick}
					disabled={!canPlaceOrder}>
					{isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
				</Button>
			</div>

			{/* Order Modal */}
			{order && (
				<Modal onClose={handleCloseModal}>
					<OrderDetails
						orderNumber={order.order?.number || order.number}
						isLoading={isOrderLoading}
						hasError={hasOrderError}
					/>
				</Modal>
			)}
		</section>
	);
};
