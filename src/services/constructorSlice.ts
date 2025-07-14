import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { TIngredientData, TConstructorIngredient } from '../utils/types';

// State type
type TConstructorState = {
	bun: TConstructorIngredient | null;
	ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
	bun: null,
	ingredients: [],
};

const constructorSlice = createSlice({
	name: 'burgerConstructor',
	initialState,
	reducers: {
		addIngredient: {
			reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
				if (action.payload.type === 'bun') {
					state.bun = action.payload;
				} else {
					state.ingredients.push(action.payload);
				}
			},
			prepare: (ingredient: TIngredientData) => ({
				payload: {
					...ingredient,
					ingredientId: nanoid(),
				},
			}),
		},
		removeIngredient: (state, action: PayloadAction<string>) => {
			state.ingredients = state.ingredients.filter(
				(item) => item.ingredientId !== action.payload
			);
		},
		moveIngredient: (
			state,
			action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
		) => {
			const { dragIndex, hoverIndex } = action.payload;
			const dragItem = state.ingredients[dragIndex];
			state.ingredients.splice(dragIndex, 1);
			state.ingredients.splice(hoverIndex, 0, dragItem);
		},
		clearConstructor: (state) => {
			state.bun = null;
			state.ingredients = [];
		},
	},
	selectors: {
		getBun: (state) => state.bun,
		getIngredients: (state) => state.ingredients,
		getTotalPrice: (state) => {
			const bunPrice = state.bun ? state.bun.price * 2 : 0;
			const ingredientsPrice = state.ingredients.reduce(
				(total, item) => total + item.price,
				0
			);
			return bunPrice + ingredientsPrice;
		},
		getCanOrder: (state) => state.bun !== null && state.ingredients.length > 0,
		getIngredientsCount: (state) => {
			const count: Record<string, number> = {};

			// Count bun
			if (state.bun) {
				count[state.bun._id] = 2; // Bun is used twice
			}

			// Count other ingredients
			state.ingredients.forEach((ingredient) => {
				count[ingredient._id] = (count[ingredient._id] || 0) + 1;
			});

			return count;
		},
	},
});

export const {
	addIngredient,
	removeIngredient,
	moveIngredient,
	clearConstructor,
} = constructorSlice.actions;

// Export action types
type TConstructorActionCreators = typeof constructorSlice.actions;
export type TConstructorActions = ReturnType<
	TConstructorActionCreators[keyof TConstructorActionCreators]
>;

export const {
	getBun,
	getIngredients,
	getTotalPrice,
	getCanOrder,
	getIngredientsCount,
} = constructorSlice.selectors;

export default constructorSlice.reducer;
