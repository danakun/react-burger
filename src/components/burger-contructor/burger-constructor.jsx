import React, { useMemo } from 'react';
import styles from './burger-constructor.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import {
	Button,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { BunItem } from './bun-item/bun-item';
import { FillingItem } from './filling-item/filling-item';

export const BurgerConstructor = ({ ingredients }) => {
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
				<Button type='primary' size='large' htmlType='submit'>
					Оформить заказ
				</Button>
			</div>
		</section>
	);
};

BurgerConstructor.propTypes = {
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
};
