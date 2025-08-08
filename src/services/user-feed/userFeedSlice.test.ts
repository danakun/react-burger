import { describe, test, expect, vi, beforeEach } from 'vitest';
import userFeedReducer, {
	clearUserFeed,
	clearUserFeedError,
	initialState,
} from '../user-feed/userFeedSlice';
import {
	userFeedConnect,
	userFeedConnecting,
	userFeedDisconnect,
	userFeedOpen,
	userFeedClose,
	userFeedError,
	userFeedMessage,
} from '../user-feed/actions';
import type { TUserFeedMessage } from '../../utils/types';
import { mockUserOrders } from '../../utils/mocks';

describe('userFeedSlice reducer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should return the initial state', () => {
		const result = userFeedReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	describe('regular reducers', () => {
		test('should handle clearUserFeed', () => {
			const stateWithData = {
				...initialState,
				orders: mockUserOrders,
				total: 100,
				totalToday: 10,
				error: 'Some error',
			};

			const action = clearUserFeed();
			const result = userFeedReducer(stateWithData, action);

			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.error).toBe(null);

			expect(result.isConnecting).toBe(stateWithData.isConnecting);
			expect(result.isConnected).toBe(stateWithData.isConnected);
		});

		test('should handle clearUserFeedError', () => {
			const stateWithError = {
				...initialState,
				error: 'Something went wrong',
			};

			const action = clearUserFeedError();
			const result = userFeedReducer(stateWithError, action);

			expect(result.error).toBe(null);

			expect(result.orders).toEqual(stateWithError.orders);
			expect(result.total).toBe(stateWithError.total);
			expect(result.isConnecting).toBe(stateWithError.isConnecting);
		});
	});

	describe('connection actions', () => {
		test('should handle userFeedConnect', () => {
			const stateWithError = {
				...initialState,
				error: 'Previous error',
			};

			const action = userFeedConnect('ws://localhost:3001');
			const result = userFeedReducer(stateWithError, action);

			// Test fields that should change
			expect(result.error).toBe(null);

			// Test fields that should NOT change
			expect(result.isConnecting).toBe(stateWithError.isConnecting);
			expect(result.isConnected).toBe(stateWithError.isConnected);
		});

		test('should handle userFeedConnecting', () => {
			const stateConnected = {
				...initialState,
				isConnecting: false,
				isConnected: true,
			};

			const action = userFeedConnecting();
			const result = userFeedReducer(stateConnected, action);

			expect(result.isConnecting).toBe(true);
			expect(result.isConnected).toBe(false);
			expect(result.error).toBe(null);

			expect(result.orders).toEqual(stateConnected.orders);
			expect(result.total).toBe(stateConnected.total);
		});

		test('should handle userFeedDisconnect', () => {
			const stateWithData = {
				...initialState,
				isConnected: true,
				orders: mockUserOrders,
				total: 50,
				totalToday: 5,
				error: 'Error',
			};

			const action = userFeedDisconnect();
			const result = userFeedReducer(stateWithData, action);

			// Test fields that should be reset
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe(null);
		});

		test('should handle userFeedOpen', () => {
			const connectingState = {
				...initialState,
				isConnecting: true,
			};

			const action = userFeedOpen();
			const result = userFeedReducer(connectingState, action);

			expect(result.isConnected).toBe(true);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe(null);

			expect(result.orders).toEqual(connectingState.orders);
		});

		test('should handle userFeedClose', () => {
			const connectedState = {
				...initialState,
				isConnected: true,
				isConnecting: true,
			};

			const action = userFeedClose();
			const result = userFeedReducer(connectedState, action);

			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);

			expect(result.orders).toEqual(connectedState.orders);
			expect(result.error).toBe(connectedState.error);
		});
	});

	describe('userFeedError', () => {
		test('should handle generic error', () => {
			const action = userFeedError('Some error occurred');
			const result = userFeedReducer(initialState, action);

			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe('Some error occurred');

			expect(result.orders).toEqual(initialState.orders);
		});

		test('should handle token error with friendly message', () => {
			const action = userFeedError('Invalid or missing token');
			const result = userFeedReducer(initialState, action);

			expect(result.error).toBe(
				'Ошибка авторизации. Попробуйте перезайти в систему.'
			);
			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);

			expect(result.orders).toEqual(initialState.orders);
		});
	});

	describe('userFeedMessage', () => {
		test('should handle successful message with orders', () => {
			const stateWithError = {
				...initialState,
				error: 'Old error',
			};

			const payload: TUserFeedMessage = {
				success: true,
				orders: mockUserOrders,
				total: 150,
				totalToday: 20,
			};

			const action = userFeedMessage(payload);
			const result = userFeedReducer(stateWithError, action);

			expect(result.orders).toEqual(mockUserOrders);
			expect(result.total).toBe(150);
			expect(result.totalToday).toBe(20);
			expect(result.error).toBe(null);

			expect(result.isConnecting).toBe(stateWithError.isConnecting);
			expect(result.isConnected).toBe(stateWithError.isConnected);
		});

		test('should handle unsuccessful message with error', () => {
			const payload: TUserFeedMessage & { message: string } = {
				success: false,
				message: 'Something went wrong',
				orders: [],
				total: 0,
				totalToday: 0,
			};

			const action = userFeedMessage(payload);
			const result = userFeedReducer(initialState, action);

			expect(result.error).toBe('Something went wrong');

			expect(result.orders).toEqual(initialState.orders);
			expect(result.isConnecting).toBe(initialState.isConnecting);
		});

		test('should handle token error in message payload', () => {
			const payload: TUserFeedMessage & { message: string } = {
				success: false,
				message: 'Invalid or missing token',
				orders: [],
				total: 0,
				totalToday: 0,
			};

			const action = userFeedMessage(payload);
			const result = userFeedReducer(initialState, action);

			expect(result.error).toBe(
				'Ошибка авторизации. Попробуйте перезайти в систему.'
			);

			expect(result.orders).toEqual(initialState.orders);
		});
	});
});
