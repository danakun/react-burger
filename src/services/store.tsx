import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';
import {
	useDispatch as dispatchHook,
	useSelector as selectorHook,
} from 'react-redux';

// Create root reducer using combineReducers
export const rootReducer = combineReducers({
	ingredients: ingredientsReducer,
	burgerConstructor: constructorReducer,
	order: orderReducer,
	user: userReducer,
});

// Configure store with root reducer
export const store = configureStore({
	reducer: rootReducer,
});

// Export types for TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
