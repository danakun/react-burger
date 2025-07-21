import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';
import allFeedReducer from './all-feed/allFeedSlice';
import userFeedReducer from './user-feed/userFeedSlice';
import {
	useDispatch as dispatchHook,
	useSelector as selectorHook,
} from 'react-redux';
import { socketMiddleware } from './middleware/socket-middleware';
import { allFeedWsActions } from './all-feed/actions';
import { userFeedWsActions } from './user-feed/actions';

// middleware instances
const allFeedMiddleware = socketMiddleware(allFeedWsActions, false);
const userFeedMiddleware = socketMiddleware(userFeedWsActions, true);

// root reducer
export const rootReducer = combineReducers({
	ingredients: ingredientsReducer,
	burgerConstructor: constructorReducer,
	order: orderReducer,
	user: userReducer,
	allFeed: allFeedReducer,
	userFeed: userFeedReducer,
});

// Configure store
export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					'allFeed/connect',
					'allFeed/disconnect',
					'userFeed/connect',
					'userFeed/disconnect',
				],
			},
		}).concat(allFeedMiddleware, userFeedMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
