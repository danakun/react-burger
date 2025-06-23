import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './login.module.css';

export const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
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
		// Здесь будет логика авторизации
		console.log('Login attempt:', formData);
	};

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<h1 className={`${styles.title} text text_type_main-medium mb-6`}>
						Вход
					</h1>

					<div className={`${styles.input_wrapper} mb-6`}>
						<Input
							type='email'
							placeholder='E-mail'
							value={formData.email}
							name='email'
							onChange={handleInputChange}
							size='default'
						/>
					</div>

					<div className={`${styles.input_wrapper} mb-6`}>
						<PasswordInput
							placeholder='Пароль'
							value={formData.password}
							name='password'
							onChange={handleInputChange}
						/>
					</div>

					<div className={`${styles.button_wrapper} mb-20`}>
						<Button htmlType='submit' type='primary' size='medium'>
							Войти
						</Button>
					</div>

					<div className={styles.links}>
						<p
							className={
								'text text_type_main-default text_color_inactive mb-4'
							}>
							Вы — новый пользователь?{' '}
							<Link
								to='/register'
								className={`${styles.link} text text_type_main-default`}>
								Зарегистрироваться
							</Link>
						</p>
						<p className={'text text_type_main-default text_color_inactive'}>
							Забыли пароль?{' '}
							<Link
								to='/forgot-password'
								className={`${styles.link} text text_type_main-default`}>
								Восстановить пароль
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};
