import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './forgot-password.module.css';

export const ForgotPassword = () => {
	const [formData, setFormData] = useState({
		email: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// to-do forgot pass logic
		console.log('Forgot password attempt:', formData);
	};

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<h1 className={`${styles.title} text text_type_main-medium mb-6`}>
						Восстановление пароля
					</h1>

					<div className={`${styles.input_wrapper} mb-6`}>
						<Input
							type='email'
							placeholder='Укажите e-mail'
							value={formData.email}
							name='email'
							onChange={handleInputChange}
							size='default'
						/>
					</div>

					<div className={`${styles.button_wrapper} mb-20`}>
						<Button htmlType='submit' type='primary' size='medium'>
							Восстановить
						</Button>
					</div>

					<div className={styles.links}>
						<p
							className={
								'text text_type_main-default text_color_inactive mb-4'
							}>
							Вспомнили пароль?{' '}
							<Link
								to='/login'
								className={`${styles.link} text text_type_main-default`}>
								Войти
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};
