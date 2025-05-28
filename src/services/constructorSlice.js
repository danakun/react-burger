import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	bun: null,
	ingredients: [],
};

const constructorSlice = createSlice({
	name: 'burgerConstructor',
	initialState,
	reducers: {
		addIngredient: {
			reducer: (state, action) => {
				if (action.payload.type === 'bun') {
					state.bun = action.payload;
				} else {
					state.ingredients.push(action.payload);
				}
			},
			prepare: (ingredient) => ({
				payload: {
					...ingredient,
					constructorId: crypto.randomUUID(),
				},
			}),
		},
		removeIngredient: (state, action) => {
			state.ingredients = state.ingredients.filter(
				(item) => item.constructorId !== action.payload
			);
		},
		moveIngredient: (state, action) => {
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
});

export const {
	addIngredient,
	removeIngredient,
	moveIngredient,
	clearConstructor,
} = constructorSlice.actions;

export default constructorSlice.reducer;
