import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import styles from './profile.module.css';

export const ProfileLayout = () => {
	const location = useLocation();

	// Check which route is currently active
	const isProfileActive = location.pathname === '/profile';
	const isOrdersActive = location.pathname.startsWith('/profile/orders');

	return (
		<div className={styles.container}>
			<div className={styles.sidebar}>
				<nav className={styles.navigation}>
					<Link
						to='/profile'
						className={`${styles.navLink} ${isProfileActive ? styles.navLinkActive : ''} text text_type_main-medium ${!isProfileActive ? 'text_color_inactive' : ''}`}>
						Профиль
					</Link>
					<Link
						to='/profile/orders'
						className={`${styles.navLink} ${isOrdersActive ? styles.navLinkActive : ''} text text_type_main-medium ${!isOrdersActive ? 'text_color_inactive' : ''}`}>
						История заказов
					</Link>
					<button
						className={`${styles.navLink} ${styles.logoutButton} text text_type_main-medium text_color_inactive`}
						onClick={() => console.log('Logout')}>
						Выход
					</button>
				</nav>
				<p
					className={`${styles.description} text text_type_main-default text_color_inactive mt-20`}>
					{isOrdersActive
						? 'В этом разделе вы можете просмотреть свою историю заказов'
						: 'В этом разделе вы можете изменить свои персональные данные'}
				</p>
			</div>

			<div className={styles.content}>
				{/* for rendering nested route content */}
				<Outlet />
			</div>
		</div>
	);
};
