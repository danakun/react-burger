import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './register.module.css';

export const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
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
		// to-do логика регистрации
		console.log('Register attempt:', formData);
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
							Зарегистрироваться
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
