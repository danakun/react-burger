import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { PASSWORD_RESET_ENDPOINT } from '../../utils/api';
import styles from './forgot-password.module.css';

export const ForgotPassword = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Очищаем ошибку при изменении поля
		if (error) setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.email) {
			setError('Пожалуйста, введите email');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(PASSWORD_RESET_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: formData.email,
				}),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				// Успешно отправили запрос на восстановление
				console.log('Reset email sent:', data.message);
				// Перенаправляем на страницу сброса пароля
				navigate('/reset-password', {
					state: { fromForgotPassword: true, email: formData.email },
				});
			} else {
				// Обработка ошибки от API
				setError(data.message || 'Произошла ошибка при отправке запроса');
			}
		} catch (error) {
			console.error('Forgot password error:', error);
			setError('Произошла ошибка. Пожалуйста, попробуйте позже.');
		} finally {
			setIsLoading(false);
		}
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
							error={!!error}
						/>
					</div>

					{error && (
						<p className='text text_type_main-default text_color_error mb-4'>
							{error}
						</p>
					)}

					<div className={`${styles.button_wrapper} mb-20`}>
						<Button
							htmlType='submit'
							type='primary'
							size='medium'
							disabled={isLoading}>
							{isLoading ? 'Отправляем...' : 'Восстановить'}
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
