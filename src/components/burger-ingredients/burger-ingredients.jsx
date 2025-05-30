import React, { useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';
import styles from './burger-ingredients.module.css';
import * as PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { ingredientPropType } from '@utils/prop-types.js';
import { IngredientsCategory } from './ingredients-category/ingredients-category';
import { Modal } from '../modal/modal';
import { IngredientDetails } from './ingredient-details/ingredient-details';
import {
	setCurrentIngredient,
	clearCurrentIngredient,
} from '../../services/ingredientDetailsSlice';

export const BurgerIngredients = () => {
	const dispatch = useDispatch();
	// Add redux
	const { items: ingredients } = useSelector((state) => state.ingredients);
	const { currentIngredient } = useSelector((state) => state.ingredientDetails);

	const buns = useMemo(
		() => ingredients.filter((item) => item.type === 'bun'),
		[ingredients]
	);

	const mains = useMemo(
		() => ingredients.filter((item) => item.type === 'main'),
		[ingredients]
	);

	const sauces = useMemo(
		() => ingredients.filter((item) => item.type === 'sauce'),
		[ingredients]
	);

	// dispatch action to Redux on open/close
	const handleIngredientClick = (ingredient) => {
		dispatch(setCurrentIngredient(ingredient));
	};

	const handleCloseModal = () => {
		dispatch(clearCurrentIngredient());
	};

	const titleBunRef = useRef(null);
	const titleMainRef = useRef(null);
	const titleSauceRef = useRef(null);

	const [bunsRef, inViewBuns] = useInView({
		threshold: 0,
	});

	const [mainsRef, inViewMains] = useInView({
		threshold: 0,
	});

	const [saucesRef, inViewSauces] = useInView({
		threshold: 0,
	});

	const currentTab = inViewBuns
		? 'bun'
		: inViewMains
			? 'main'
			: inViewSauces
				? 'sauce'
				: 'bun';

	const handleTabClick = (value) => {
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
						titleRef={titleBunRef}
						onIngredientClick={handleIngredientClick}
					/>
				</div>

				<div ref={mainsRef}>
					<IngredientsCategory
						title='Начинки'
						ingredients={mains}
						titleRef={titleMainRef}
						onIngredientClick={handleIngredientClick}
					/>
				</div>

				<div ref={saucesRef}>
					<IngredientsCategory
						title='Соусы'
						ingredients={sauces}
						titleRef={titleSauceRef}
						onIngredientClick={handleIngredientClick}
					/>
				</div>
			</div>

			{currentIngredient && (
				<Modal title='Детали ингредиента' onClose={handleCloseModal}>
					<IngredientDetails ingredient={currentIngredient} />
				</Modal>
			)}
		</section>
	);
};

BurgerIngredients.propTypes = {
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired),
};
