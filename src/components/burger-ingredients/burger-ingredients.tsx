import React, { useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';
import styles from './burger-ingredients.module.css';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { IngredientsCategory } from './ingredients-category/ingredients-category';
import { TIngredientData } from '@/utils/types';

type TCategorizedIngredients = {
	buns: TIngredientData[];
	mains: TIngredientData[];
	sauces: TIngredientData[];
};
export const BurgerIngredients = (): React.JSX.Element => {
	// Add redux
	const { items: ingredients } = useSelector((state) => state.ingredients);

	const { buns, mains, sauces } = useMemo((): TCategorizedIngredients => {
		return {
			buns: ingredients.filter((item: TIngredientData) => item.type === 'bun'),
			mains: ingredients.filter(
				(item: TIngredientData) => item.type === 'main'
			),
			sauces: ingredients.filter(
				(item: TIngredientData) => item.type === 'sauce'
			),
		};
	}, [ingredients]);

	const titleBunRef = useRef<HTMLHeadingElement>(null);
	const titleMainRef = useRef<HTMLHeadingElement>(null);
	const titleSauceRef = useRef<HTMLHeadingElement>(null);

	const [bunsRef, inViewBuns] = useInView({
		threshold: 0,
	});

	const [mainsRef, inViewMains] = useInView({
		threshold: 0,
	});

	const [saucesRef, inViewSauces] = useInView({
		threshold: 0,
	});

	let currentTab = 'bun';
	if (inViewBuns) {
		currentTab = 'bun';
	} else if (inViewMains) {
		currentTab = 'main';
	} else if (inViewSauces) {
		currentTab = 'sauce';
	}

	const handleTabClick = (value: string): void => {
		if (value === 'bun') {
			titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
		} else if (value === 'main') {
			titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
		} else if (value === 'sauce') {
			titleSauceRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<section className={styles.burger_ingredients} data-cy='ingredients'>
			<nav>
				<ul className={styles.menu}>
					<li>
						<Tab
							value='bun'
							active={currentTab === 'bun'}
							onClick={handleTabClick}>
							Булки
						</Tab>
					</li>
					<li>
						<Tab
							value='main'
							active={currentTab === 'main'}
							onClick={handleTabClick}>
							Начинки
						</Tab>
					</li>
					<li>
						<Tab
							value='sauce'
							active={currentTab === 'sauce'}
							onClick={handleTabClick}>
							Соусы
						</Tab>
					</li>
				</ul>
			</nav>

			<div className={`${styles.ingredients_container} custom-scroll`}>
				<div ref={bunsRef}>
					<IngredientsCategory
						title='Булки'
						ingredients={buns}
						ids={bunsRef}
						titleRef={titleBunRef}
					/>
				</div>

				<div ref={mainsRef}>
					<IngredientsCategory
						title='Начинки'
						ingredients={mains}
						ids={mainsRef}
						titleRef={titleMainRef}
					/>
				</div>

				<div ref={saucesRef}>
					<IngredientsCategory
						title='Соусы'
						ingredients={sauces}
						ids={saucesRef}
						titleRef={titleSauceRef}
					/>
				</div>
			</div>
		</section>
	);
};
