import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { resetPasswordRequest } from '../../utils/api';
import styles from './reset-password.module.css';

export const ResetPassword = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		password: '',
		token: '',
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

		if (!formData.password || !formData.token) {
			setError('Пожалуйста, заполните все поля');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			// Use the API function from utils/api.js
			await resetPasswordRequest(formData.password, formData.token);

			// Clear the localStorage flag after successful reset
			localStorage.removeItem('resetPassword');

			// Navigate to login page
			navigate('/login', {
				replace: true,
				state: {
					message: 'Пароль успешно изменен. Войдите с новым паролем.',
				},
			});
		} catch (error) {
			console.error('Reset password error:', error);
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
							{isLoading ? 'Сохраняем...' : 'Сохранить'}
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
