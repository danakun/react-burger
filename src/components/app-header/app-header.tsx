import { Link, NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import {
	BurgerIcon,
	ListIcon,
	ProfileIcon,
	Logo,
} from '@ya.praktikum/react-developer-burger-ui-components';

export const AppHeader = (): React.JSX.Element => {
	return (
		<header className={styles.header}>
			<nav className={`${styles.menu} p-4`}>
				<div className={styles.menu_part_left}>
					<NavLink
						to='/'
						className={({ isActive }) =>
							`${styles.link} ${isActive ? styles.link_active : ''}`
						}>
						{({ isActive }) => (
							<>
								<BurgerIcon type={isActive ? 'primary' : 'secondary'} />
								<p className='text text_type_main-default ml-2'>Конструктор</p>
							</>
						)}
					</NavLink>

					<NavLink
						to='/feed'
						className={({ isActive }) =>
							`${styles.link} ml-10 ${isActive ? styles.link_active : ''}`
						}>
						{({ isActive }) => (
							<>
								<ListIcon type={isActive ? 'primary' : 'secondary'} />
								<p className='text text_type_main-default ml-2'>
									Лента заказов
								</p>
							</>
						)}
					</NavLink>
				</div>

				<Link to='/'>
					<div className={styles.logo}>
						<Logo />
					</div>
				</Link>

				<NavLink
					to='/profile'
					className={({ isActive }) =>
						`${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
					}>
					{({ isActive }) => (
						<>
							<ProfileIcon type={isActive ? 'primary' : 'secondary'} />
							<p className='text text_type_main-default ml-2'>Личный кабинет</p>
						</>
					)}
				</NavLink>
			</nav>
		</header>
	);
};
