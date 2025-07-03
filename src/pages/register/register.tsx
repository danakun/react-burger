import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { AUTH_REGISTER_ENDPOINT } from '../../utils/api';
import styles from './register.module.css';

export const Register = (): React.JSX.Element => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Очищаем ошибку при изменении поля
		if (error) setError('');
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Валидация формы
		if (!formData.name || !formData.email || !formData.password) {
			setError('Пожалуйста, заполните все поля');
			return;
		}

		if (formData.password.length < 6) {
			setError('Пароль должен содержать минимум 6 символов');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(AUTH_REGISTER_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					name: formData.name,
				}),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				// Успешная регистрация
				console.log('Registration successful:', data);

				// Сохраняем токены если они есть в ответе
				if (data.accessToken) {
					localStorage.setItem('accessToken', data.accessToken);
				}
				if (data.refreshToken) {
					localStorage.setItem('refreshToken', data.refreshToken);
				}

				// Перенаправляем на главную страницу или страницу входа
				navigate('/', {
					state: { message: 'Регистрация прошла успешно!' },
				});
			} else {
				// Обработка ошибки от API
				if (data.message) {
					setError(data.message);
				} else {
					setError('Произошла ошибка при регистрации');
				}
			}
		} catch (error) {
			console.error('Registration error:', error);
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
						Регистрация
					</h1>

					<div className={`${styles.input_wrapper} mb-6`}>
						<Input
							type='text'
							placeholder='Имя'
							value={formData.name}
							name='name'
							onChange={handleInputChange}
							size='default'
							error={!!error}
						/>
					</div>

					<div className={`${styles.input_wrapper} mb-6`}>
						<Input
							type='email'
							placeholder='E-mail'
							value={formData.email}
							name='email'
							onChange={handleInputChange}
							size='default'
							error={!!error}
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
							{isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
						</Button>
					</div>

					<div className={styles.links}>
						<p className={'text text_type_main-default text_color_inactive'}>
							Уже зарегистрированы?{' '}
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
