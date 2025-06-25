import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { forgotPasswordRequest } from '../../utils/api'; // Use the API function
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
			// Use the API function from utils/api.js
			await forgotPasswordRequest(formData.email);

			// Set the localStorage flag for reset password access
			localStorage.setItem('resetPassword', 'true');

			// Navigate to reset password page
			navigate('/reset-password', { replace: true });
		} catch (error) {
			console.error('Forgot password error:', error);
			setError(
				error.message || 'Произошла ошибка. Пожалуйста, попробуйте позже.'
			);
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
