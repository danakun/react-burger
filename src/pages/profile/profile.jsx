import React, { useState } from 'react';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './profile.module.css';

export const Profile = () => {
	const [formData, setFormData] = useState({
		name: 'Dana',
		email: 'mail@danakun.com',
		password: '',
	});

	const [isEditing, setIsEditing] = useState({
		name: false,
		email: false,
		password: false,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCancel = () => {
		// Сброс формы к исходным значениям
		setFormData({
			name: 'Марк',
			email: 'mail@stellar-burgers',
			password: '',
		});
		setIsEditing({
			name: false,
			email: false,
			password: false,
		});
	};

	const handleSave = (e) => {
		e.preventDefault();
		// to-do save profile logic
		console.log('Save profile:', formData);
		setIsEditing({
			name: false,
			email: false,
			password: false,
		});
	};

	const hasChanges =
		formData.name !== 'Марк' ||
		formData.email !== 'mail@stellar-burgers' ||
		formData.password !== '';

	return (
		<div className={styles.container}>
			<div className={styles.sidebar}>
				<nav className={styles.navigation}>
					<div
						className={`${styles.navLink} ${styles.navLinkActive} text text_type_main-medium`}>
						Профиль
					</div>
					<div
						className={`${styles.navLink} text text_type_main-medium text_color_inactive`}>
						История заказов
					</div>
					<button
						className={`${styles.navLink} ${styles.logoutButton} text text_type_main-medium text_color_inactive`}
						onClick={() => console.log('Logout')}>
						Выход
					</button>
				</nav>
				<p
					className={`${styles.description} text text_type_main-default text_color_inactive mt-20`}>
					В этом разделе вы можете изменить свои персональные данные
				</p>
			</div>

			<div className={styles.content}>
				<form className={styles.form} onSubmit={handleSave}>
					<div className={`${styles.input_wrapper} mb-6`}>
						<Input
							type='text'
							placeholder='Имя'
							value={formData.name}
							name='name'
							onChange={handleInputChange}
							icon={isEditing.name ? undefined : 'EditIcon'}
							onIconClick={() =>
								setIsEditing((prev) => ({ ...prev, name: true }))
							}
							disabled={!isEditing.name}
							size='default'
						/>
					</div>

					<div className={`${styles.input_wrapper} mb-6`}>
						<Input
							type='email'
							placeholder='Логин'
							value={formData.email}
							name='email'
							onChange={handleInputChange}
							icon={isEditing.email ? undefined : 'EditIcon'}
							onIconClick={() =>
								setIsEditing((prev) => ({ ...prev, email: true }))
							}
							disabled={!isEditing.email}
							size='default'
						/>
					</div>

					<div className={`${styles.input_wrapper} mb-6`}>
						<PasswordInput
							placeholder='Пароль'
							value={formData.password}
							name='password'
							onChange={handleInputChange}
							icon={isEditing.password ? undefined : 'EditIcon'}
						/>
					</div>

					{hasChanges && (
						<div className={styles.buttons}>
							<Button
								htmlType='button'
								type='secondary'
								size='medium'
								onClick={handleCancel}>
								Отмена
							</Button>
							<Button htmlType='submit' type='primary' size='medium'>
								Сохранить
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
