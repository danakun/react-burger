import React, { useMemo, useState } from 'react';
import styles from './burger-constructor.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import {
	CurrencyIcon,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { BunItem } from './bun-item/bun-item';
import { FillingItem } from './filling-item/filling-item';
import { Modal } from '../modal/modal';
import { OrderDetails } from './order-details/order-details';

export const BurgerConstructor = ({ ingredients }) => {
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

	const buns = ingredients.filter((item) => item.type === 'bun');
	const fillings = ingredients.filter((item) => item.type !== 'bun');

	const selectedBun = buns.length > 0 ? buns[0] : null;

	const totalPrice = useMemo(() => {
		let price = 0;

		if (selectedBun) {
			price += selectedBun.price * 2;
		}

		fillings.forEach((item) => {
			price += item.price;
		});

		return price;
	}, [selectedBun, fillings]);

	// Hardcoded
	const orderNumber = '034537';

	const handleOrderClick = () => {
		setIsOrderModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsOrderModalOpen(false);
	};

	return (
		<section className={styles.burger_constructor}>
			<div className={styles.burger_components}>
				{selectedBun && (
					<BunItem bun={selectedBun} type='top' isLocked={true} />
				)}

				<ul className={`${styles.fillings_list} custom-scroll`}>
					{fillings.map((item) => (
						<FillingItem key={item._id} filling={item} isDraggable={true} />
					))}
				</ul>

				{selectedBun && (
					<BunItem bun={selectedBun} type='bottom' isLocked={true} />
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
					disabled={!selectedBun || fillings.length === 0}>
					Оформить заказ
				</Button>
			</div>

			{/* Modal */}
			{isOrderModalOpen && (
				<Modal onClose={handleCloseModal}>
					<OrderDetails orderNumber={orderNumber} />
				</Modal>
			)}
		</section>
	);
};

BurgerConstructor.propTypes = {
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
};
