import React from 'react';
import { string, bool } from 'prop-types';
// import { useSelector } from 'react-redux';
import doneIcon from '../../../assets/images/done.svg';
import { Preloader } from '@components/preloader/preloader.jsx';
import styles from './order-details.module.css';

export const OrderDetails = ({ orderNumber, isLoading, hasError }) => {
	if (isLoading) {
		return (
			<div className={styles.container}>
				<Preloader />
				<p className='text text_type_main-medium mt-4'>Оформляем заказ...</p>
			</div>
		);
	}

	if (hasError) {
		return (
			<div className={styles.container}>
				<p className='text text_type_main-medium text_color_error'>
					Произошла ошибка при оформлении заказа
				</p>
				<p className='text text_type_main-default text_color_inactive mt-2'>
					Попробуйте еще раз
				</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<p className={`${styles.orderNumber} text text_type_digits-large mb-8`}>
				{orderNumber}
			</p>

			<p className='text text_type_main-medium mb-15'>идентификатор заказа</p>

			<div className={styles.doneIconWrapper}>
				<img src={doneIcon} alt='Готово' className={styles.doneIcon} />
			</div>

			<p className='text text_type_main-default mb-2 mt-15'>
				Ваш заказ начали готовить
			</p>

			<p className='text text_type_main-default text_color_inactive'>
				Дождитесь готовности на орбитальной станции
			</p>
		</div>
	);
};

OrderDetails.propTypes = {
	orderNumber: string,
	isLoading: bool,
	hasError: bool,
};
