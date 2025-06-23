import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './reset-password.module.css';

export const ResetPassword = () => {
	const [formData, setFormData] = useState({
		password: '',
		token: '',
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
		// to-do reset password logic
		console.log('Reset password attempt:', formData);
	};

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<h1 className={`${styles.title} text text_type_main-medium mb-6`}>
						Восстановление пароля
					</h1>

					<div className={`${styles.input_wrapper} mb-6`}>
						<PasswordInput
							placeholder='Введите новый пароль'
							value={formData.password}
							name='password'
							onChange={handleInputChange}
						/>
					</div>

					<div className={`${styles.input_wrapper} mb-6`}>
						<Input
							type='text'
							placeholder='Введите код из письма'
							value={formData.token}
							name='token'
							onChange={handleInputChange}
							size='default'
						/>
					</div>

					<div className={`${styles.button_wrapper} mb-20`}>
						<Button htmlType='submit' type='primary' size='medium'>
							Сохранить
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
