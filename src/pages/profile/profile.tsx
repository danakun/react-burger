import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '@/services/store';
import {
	Input,
	Button,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { updateUser } from '../../services/actions';
import { getUserData } from '../../services/userSlice';
import styles from './profile.module.css';
import { TUserData } from '@/utils/types';

// Form data type
type FormData = {
	name: string;
	email: string;
	password: string;
};

// Editing state type
type EditingState = {
	name: boolean;
	email: boolean;
	password: boolean;
};

export const Profile = (): React.JSX.Element => {
	const dispatch = useDispatch();
	const user = useSelector(getUserData) as TUserData | null;

	// Get loading and error states from Redux
	const { updateUserRequest, updateUserFailed } = useSelector(
		(state) => state.user
	);

	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		password: '',
	});

	const [isEditing, setIsEditing] = useState<EditingState>({
		name: false,
		email: false,
		password: false,
	});

	// Initialize form with user data when user loads
	useEffect((): void => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				password: '',
			});
		}
	}, [user]);

	// Define initial values based on user data
	const initialValues: FormData = {
		name: user?.name || '',
		email: user?.email || '',
		password: '',
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCancel = (): void => {
		// Reset form to initial values (actual user data)
		setFormData(initialValues);
		setIsEditing({
			name: false,
			email: false,
			password: false,
		});
	};

	const handleSave = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();

		try {
			// Dispatch the updateUser action
			await dispatch(
				updateUser({
					name: formData.name,
					email: formData.email,
					...(formData.password && { password: formData.password }),
				})
			).unwrap();

			// Reset editing state and clear password on success
			setIsEditing({
				name: false,
				email: false,
				password: false,
			});

			setFormData((prev: FormData) => ({
				...prev,
				password: '', // Clear password field after successful update
			}));
		} catch (error) {
			console.error('Failed to update profile:', error);
		}
	};

	const handleIconClick = (field: keyof EditingState): void => {
		setIsEditing((prev: EditingState) => ({
			...prev,
			[field]: true,
		}));
	};

	// Check if any field has been changed from initial values
	const hasChanges: boolean =
		formData.name !== initialValues.name ||
		formData.email !== initialValues.email ||
		formData.password !== '';

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
					onIconClick={() => handleIconClick('name')}
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
					onIconClick={() => handleIconClick('email')}
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

			{/* Show error message if update failed */}
			{updateUserFailed && (
				<p className='text text_type_main-default text_color_error mb-4'>
					Ошибка при обновлении данных. Попробуйте снова.
				</p>
			)}

			{hasChanges && (
				<div className={styles.buttons}>
					<Button
						htmlType='button'
						type='secondary'
						size='medium'
						onClick={handleCancel}
						disabled={updateUserRequest}>
						Отмена
					</Button>
					<Button
						htmlType='submit'
						type='primary'
						size='medium'
						disabled={updateUserRequest}>
						{updateUserRequest ? 'Сохраняем...' : 'Сохранить'}
					</Button>
				</div>
			)}
		</form>
	);
};
