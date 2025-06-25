import React, { useState } from 'react';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './profile.module.css';

export const Profile = () => {
	// Define initial values as constants to ensure consistency
	const initialValues = {
		name: 'Dana',
		email: 'mail@danakun.com',
		password: '',
	};

	const [formData, setFormData] = useState(initialValues);

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
		// Reset form to initial values
		setFormData(initialValues);
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

	// Check if any field has been changed from initial values
	const hasChanges =
		formData.name !== initialValues.name ||
		formData.email !== initialValues.email ||
		formData.password !== initialValues.password;

	return (
		<form className={styles.form} onSubmit={handleSave}>
			<div className={`${styles.input_wrapper} mb-6`}>
				<Input
					type='text'
					placeholder='Имя'
					value={formData.name}
					name='name'
					onChange={handleInputChange}
					icon={isEditing.name ? undefined : 'EditIcon'}
					onIconClick={() => setIsEditing((prev) => ({ ...prev, name: true }))}
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
					onIconClick={() => setIsEditing((prev) => ({ ...prev, email: true }))}
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
	);
};

// import React, { useState } from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import {
// 	Input,
// 	Button,
// 	PasswordInput,
// } from '@ya.praktikum/react-developer-burger-ui-components';
// import styles from './profile.module.css';

// export const Profile = () => {
// 	const location = useLocation();
// 	const navigate = useNavigate();

// 	// Define initial values as constants to ensure consistency
// 	const initialValues = {
// 		name: 'Dana',
// 		email: 'mail@danakun.com',
// 		password: '',
// 	};

// 	const [formData, setFormData] = useState(initialValues);

// 	const [isEditing, setIsEditing] = useState({
// 		name: false,
// 		email: false,
// 		password: false,
// 	});

// 	const handleInputChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData((prev) => ({
// 			...prev,
// 			[name]: value,
// 		}));
// 	};

// 	const handleCancel = () => {
// 		// Reset form to initial values
// 		setFormData(initialValues);
// 		setIsEditing({
// 			name: false,
// 			email: false,
// 			password: false,
// 		});
// 	};

// 	const handleSave = (e) => {
// 		e.preventDefault();
// 		// to-do save profile logic
// 		console.log('Save profile:', formData);
// 		setIsEditing({
// 			name: false,
// 			email: false,
// 			password: false,
// 		});
// 	};

// 	// Check if any field has been changed from initial values
// 	const hasChanges =
// 		formData.name !== initialValues.name ||
// 		formData.email !== initialValues.email ||
// 		formData.password !== initialValues.password;

// 	// Check if current path is active
// 	const isProfileActive = location.pathname === '/profile';
// 	const isOrdersActive = location.pathname === '/profile/orders';

// 	return (
// 		<div className={styles.container}>
// 			<div className={styles.sidebar}>
// 				<nav className={styles.navigation}>
// 					<Link
// 						to='/profile'
// 						className={`${styles.navLink} ${isProfileActive ? styles.navLinkActive : ''} text text_type_main-medium ${!isProfileActive ? 'text_color_inactive' : ''}`}>
// 						Профиль
// 					</Link>
// 					<Link
// 						to='/profile/orders'
// 						className={`${styles.navLink} ${isOrdersActive ? styles.navLinkActive : ''} text text_type_main-medium ${!isOrdersActive ? 'text_color_inactive' : ''}`}>
// 						История заказов
// 					</Link>
// 					<button
// 						className={`${styles.navLink} ${styles.logoutButton} text text_type_main-medium text_color_inactive`}
// 						onClick={() => console.log('Logout')}>
// 						Выход
// 					</button>
// 				</nav>
// 				<p
// 					className={`${styles.description} text text_type_main-default text_color_inactive mt-20`}>
// 					В этом разделе вы можете изменить свои персональные данные
// 				</p>
// 			</div>

// 			<div className={styles.content}>
// 				<form className={styles.form} onSubmit={handleSave}>
// 					<div className={`${styles.input_wrapper} mb-6`}>
// 						<Input
// 							type='text'
// 							placeholder='Имя'
// 							value={formData.name}
// 							name='name'
// 							onChange={handleInputChange}
// 							icon={isEditing.name ? undefined : 'EditIcon'}
// 							onIconClick={() =>
// 								setIsEditing((prev) => ({ ...prev, name: true }))
// 							}
// 							disabled={!isEditing.name}
// 							size='default'
// 						/>
// 					</div>

// 					<div className={`${styles.input_wrapper} mb-6`}>
// 						<Input
// 							type='email'
// 							placeholder='Логин'
// 							value={formData.email}
// 							name='email'
// 							onChange={handleInputChange}
// 							icon={isEditing.email ? undefined : 'EditIcon'}
// 							onIconClick={() =>
// 								setIsEditing((prev) => ({ ...prev, email: true }))
// 							}
// 							disabled={!isEditing.email}
// 							size='default'
// 						/>
// 					</div>

// 					<div className={`${styles.input_wrapper} mb-6`}>
// 						<PasswordInput
// 							placeholder='Пароль'
// 							value={formData.password}
// 							name='password'
// 							onChange={handleInputChange}
// 							icon={isEditing.password ? undefined : 'EditIcon'}
// 						/>
// 					</div>

// 					{hasChanges && (
// 						<div className={styles.buttons}>
// 							<Button
// 								htmlType='button'
// 								type='secondary'
// 								size='medium'
// 								onClick={handleCancel}>
// 								Отмена
// 							</Button>
// 							<Button htmlType='submit' type='primary' size='medium'>
// 								Сохранить
// 							</Button>
// 						</div>
// 					)}
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
