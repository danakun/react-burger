import React, { useState, useRef, useEffect } from 'react';
import styles from './burger-ingredients.module.css';
import * as PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { ingredientPropType } from '@utils/prop-types.js';
import { IngredientsCategory } from './ingredients-category/ingredients-category';
import { useInView } from 'react-intersection-observer';

export const BurgerIngredients = ({ ingredients }) => {
	const [currentTab, setCurrentTab] = useState('bun');

	const titleBunRef = useRef(null);
	const titleMainRef = useRef(null);
	const titleSauceRef = useRef(null);

	const buns = ingredients.filter((item) => item.type === 'bun');
	const mains = ingredients.filter((item) => item.type === 'main');
	const sauces = ingredients.filter((item) => item.type === 'sauce');

	const [bunsRef, inViewBuns] = useInView({
		threshold: 0,
	});

	const [mainsRef, inViewMains] = useInView({
		threshold: 0,
	});

	const [saucesRef, inViewSauces] = useInView({
		threshold: 0,
	});

	useEffect(() => {
		if (inViewBuns) {
			setCurrentTab('bun');
		} else if (inViewMains) {
			setCurrentTab('main');
		} else if (inViewSauces) {
			setCurrentTab('sauce');
		}
	}, [inViewBuns, inViewMains, inViewSauces]);

	const handleTabClick = (value) => {
		setCurrentTab(value);

		if (value === 'bun') {
			titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
		} else if (value === 'main') {
			titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
		} else if (value === 'sauce') {
			titleSauceRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<section className={styles.burger_ingredients}>
			<nav>
				<ul className={styles.menu}>
					<Tab
						value='bun'
						active={currentTab === 'bun'}
						onClick={handleTabClick}>
						Булки
					</Tab>
					<Tab
						value='main'
						active={currentTab === 'main'}
						onClick={handleTabClick}>
						Начинки
					</Tab>
					<Tab
						value='sauce'
						active={currentTab === 'sauce'}
						onClick={handleTabClick}>
						Соусы
					</Tab>
				</ul>
			</nav>

			<div className={`${styles.ingredients_container} custom-scroll`}>
				<div ref={bunsRef}>
					<IngredientsCategory
						title='Булки'
						ingredients={buns}
						titleRef={titleBunRef}
					/>
				</div>

				<div ref={mainsRef}>
					<IngredientsCategory
						title='Начинки'
						ingredients={mains}
						titleRef={titleMainRef}
					/>
				</div>

				<div ref={saucesRef}>
					<IngredientsCategory
						title='Соусы'
						ingredients={sauces}
						titleRef={titleSauceRef}
					/>
				</div>
			</div>
		</section>
	);
};

BurgerIngredients.propTypes = {
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
};
