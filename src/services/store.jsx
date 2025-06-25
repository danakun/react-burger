import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../services/ingredientsSlice';
import constructorReducer from '../services/constructorSlice';
import orderReducer from '../services/orderSlice';
import userReducer from '../services/userSlice';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsReducer,
		burgerConstructor: constructorReducer,
		order: orderReducer,
		user: userReducer,
	},
});
