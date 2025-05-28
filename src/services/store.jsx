import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../services/ingredientsSlice';
import constructorReducer from '../services/constructorSlice';
import ingredientDetailsReducer from '../services/ingredientDetailsSlice';
import orderReducer from '../services/orderSlice';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsReducer,
		burgerConstructor: constructorReducer,
		ingredientDetails: ingredientDetailsReducer,
		order: orderReducer,
	},
});
