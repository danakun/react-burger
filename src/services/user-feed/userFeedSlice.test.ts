import { describe, it, expect, vi, beforeEach } from 'vitest';
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

	it('should return the initial state when called with undefined state', () => {
		const result = userFeedReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	describe('regular reducers for clearing data', () => {
		it('should clear all user feed data while preserving connection state', () => {
			const stateWithData = {
				...initialState,
				orders: mockUserOrders,
				total: 100,
				totalToday: 10,
				error: 'Some error',
			};

			const action = clearUserFeed();
			const result = userFeedReducer(stateWithData, action);

			// should clear data fields
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.error).toBe(null);

			expect(result.isConnecting).toBe(stateWithData.isConnecting);
			expect(result.isConnected).toBe(stateWithData.isConnected);
		});

		it('should clear only error state while preserving all other data', () => {
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

	describe('WebSocket connection lifecycle', () => {
		it('should clear existing errors when initiating connection', () => {
			const stateWithError = {
				...initialState,
				error: 'Previous error',
			};

			const action = userFeedConnect('ws://localhost:3001');
			const result = userFeedReducer(stateWithError, action);

			// clear error on connection attempt
			expect(result.error).toBe(null);

			expect(result.isConnecting).toBe(stateWithError.isConnecting);
			expect(result.isConnected).toBe(stateWithError.isConnected);
		});

		it('should set connecting state and clear previous connection', () => {
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

		it('should reset all state when disconnecting', () => {
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

			// reset everything to initial state
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe(null);
		});

		it('should mark connection as established when WebSocket opens', () => {
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

		it('should mark connection as closed while preserving data and errors', () => {
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

	describe('WebSocket error handling', () => {
		it('should handle generic WebSocket errors by closing connection', () => {
			const action = userFeedError('Some error occurred');
			const result = userFeedReducer(initialState, action);

			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe('Some error occurred');

			expect(result.orders).toEqual(initialState.orders);
		});

		it('should provide message for token authentication errors', () => {
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

	describe('WebSocket message processing', () => {
		it('should update state with successful message containing orders', () => {
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

		it('should handle unsuccessful messages by setting error state', () => {
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

		it('should provide error for token errors in message payload', () => {
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
