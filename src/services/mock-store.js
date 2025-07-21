import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { rootReducer } from './store.tsx';

// Create a mock store with initial state
export const createMockStore = (initialState = {}) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState: initialState,
		// Remove middleware for testing to avoid WebSocket connections
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: false,
			}),
	});
};

// Custom render function that includes Redux Provider
export const renderWithProvider = (
	ui,
	{
		initialState = {},
		store = createMockStore(initialState),
		...renderOptions
	} = {}
) => {
	const Wrapper = ({ children }) => (
		<Provider store={store}>{children}</Provider>
	);

	return {
		store,
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
	};
};

// Default mock state that matches your store structure
export const defaultMockState = {
	ingredients: {
		items: [],
		isLoading: false,
		hasError: false,
	},
	burgerConstructor: {
		bun: null,
		ingredients: [],
	},
	order: {
		orderDetails: null,
		isLoading: false,
		hasError: false,
	},
	user: {
		user: null,
		isLoading: false,
		hasError: false,
	},
	allFeed: {
		orders: [],
		total: 0,
		totalToday: 0,
		isConnected: false,
	},
	userFeed: {
		orders: [],
		total: 0,
		totalToday: 0,
		isConnected: false,
	},
};
