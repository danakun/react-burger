import { DndProvider } from 'react-dnd';
import { useSelector } from '../../services/store';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './home.module.css';
import { BurgerIngredients } from '@/components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@/components/burger-contructor/burger-constructor';
import { Preloader } from '@/components/preloader/preloader';

export const Home = (): React.JSX.Element => {
	const { isLoading, hasError } = useSelector((state) => state.ingredients);

	return (
		<main className={styles.home}>
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<div className={`${styles.main} pl-5 pr-5`}>
				{isLoading ? (
					<Preloader />
				) : hasError ? (
					<p className='text text_type_main-medium text_color_error'>
						Произошла ошибка при загрузке ингредиентов. Пожалуйста, попробуйте
						позже.
					</p>
				) : (
					<>
						<DndProvider backend={HTML5Backend}>
							<BurgerIngredients />
							<BurgerConstructor />
						</DndProvider>
					</>
				)}
			</div>
		</main>
	);
};
