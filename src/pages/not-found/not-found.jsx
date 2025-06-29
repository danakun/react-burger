import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './not-found.module.css';

export const NotFound = () => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<p className={`${styles.digits} text text_type_digits-large`}>404</p>
				<h1 className={`${styles.title} text text_type_main-large mb-4`}>
					Страница не найдена
				</h1>
				<p
					className={`${styles.description} text text_type_main-default text_color_inactive mb-8`}>
					Возможно вы ввели неверный космический адрес
				</p>
				<Link to='/' className={styles.linkButton}>
					<Button type='primary' size='medium' htmlType='button'>
						На главную
					</Button>
				</Link>
			</div>
		</div>
	);
};
