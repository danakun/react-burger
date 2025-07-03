import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
// @ts-expect-error "Ignore"
import { login } from '../../services/actions';
import {
	clearErrors,
	getLoginRequest,
	getLoginFailed,
	// @ts-expect-error "Ignore"
} from '../../services/userSlice';
import styles from './login.module.css';

export const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const loginRequest = useSelector(getLoginRequest) as boolean;
	const loginFailed = useSelector(getLoginFailed) as boolean;

	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();

		// Очищаем предыдущие ошибки
		dispatch(clearErrors());

		try {
			await dispatch(login(form)).unwrap();

			// После успешной авторизации переадресовываем
			const from = location.state?.from?.pathname || '/';
			navigate(from, { replace: true });
		} catch (error) {
			console.error('Login failed:', error);
		}
	};

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h2 className='text text_type_main-medium mb-6'>Вход</h2>

				<div className='mb-6'>
					<Input
						type='email'
						placeholder='E-mail'
						name='email'
						value={form.email}
						onChange={handleInputChange}
						required
					/>
				</div>

				<div className='mb-6'>
					<Input
						type='password'
						placeholder='Пароль'
						name='password'
						value={form.password}
						onChange={handleInputChange}
						icon='ShowIcon'
						required
					/>
				</div>

				{loginFailed && (
					<p className='text text_type_main-default text_color_error mb-4'>
						Ошибка при входе. Проверьте данные и попробуйте снова.
					</p>
				)}

				<div className='mb-20'>
					<Button
						type='primary'
						size='medium'
						htmlType='submit'
						disabled={loginRequest}>
						{loginRequest ? 'Вход...' : 'Войти'}
					</Button>
				</div>

				<div className={styles.links}>
					<p className='text text_type_main-default text_color_inactive mb-4'>
						Вы — новый пользователь?{' '}
						<Link to='/register' className={styles.link}>
							Зарегистрироваться
						</Link>
					</p>
					<p className='text text_type_main-default text_color_inactive'>
						Забыли пароль?{' '}
						<Link to='/forgot-password' className={styles.link}>
							Восстановить пароль
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
};
