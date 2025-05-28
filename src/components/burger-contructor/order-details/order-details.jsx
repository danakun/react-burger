import React from 'react';
import { string } from 'prop-types';
import doneIcon from '../../../assets/images/done.svg';
import styles from './order-details.module.css';

export const OrderDetails = ({ orderNumber }) => {
	return (
		<div className={styles.container}>
			<p className={`${styles.orderNumber} text text_type_digits-large mb-8`}>
				{orderNumber}
			</p>

			<p className='text text_type_main-medium mb-15'>идентификатор заказа</p>

			<div className={styles.doneIconWrapper}>
				<img src={doneIcon} alt='Готово' className={styles.doneIcon} />
			</div>

			<p className='text  text_type_main-default mb-2 mt-15'>
				Ваш заказ начали готовить
			</p>

			<p className='text text_type_main-default text_color_inactive'>
				Дождитесь готовности на орбитальной станции
			</p>
		</div>
	);
};

OrderDetails.propTypes = {
	orderNumber: string.isRequired,
};
