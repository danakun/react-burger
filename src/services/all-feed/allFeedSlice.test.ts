import { describe, test, expect, vi, beforeEach } from 'vitest';
import allFeedReducer, { initialState } from '../all-feed/allFeedSlice';
import {
	allFeedConnect,
	allFeedConnecting,
	allFeedDisconnect,
	allFeedOpen,
	allFeedClose,
	allFeedError,
	allFeedMessage,
} from '../all-feed/actions';
import type { AllOrdersMessage } from '../ws-types';
import { mockValidOrders, mockInvalidOrders } from '../../utils/mocks';

describe('allFeedSlice reducer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should return the initial state', () => {
		const result = allFeedReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	describe('connection actions', () => {
		test('should handle allFeedConnect', () => {
			const stateWithError = {
				...initialState,
				error: 'Previous error',
			};

			const action = allFeedConnect('ws://localhost:3001');
			const result = allFeedReducer(stateWithError, action);

			// Test fields that should change
			expect(result.error).toBe(null);

			// Test fields that should NOT change
			expect(result.isConnecting).toBe(stateWithError.isConnecting);
			expect(result.isConnected).toBe(stateWithError.isConnected);
			expect(result.orders).toEqual(stateWithError.orders);
		});

		test('should handle allFeedConnecting', () => {
			const stateConnected = {
				...initialState,
				isConnecting: false,
				isConnected: true,
				error: 'Some error',
			};

			const action = allFeedConnecting();
			const result = allFeedReducer(stateConnected, action);

			// Test fields that should change
			expect(result.isConnecting).toBe(true);
			expect(result.isConnected).toBe(false);
			expect(result.error).toBe(null);

			// Test fields that should NOT change
			expect(result.orders).toEqual(stateConnected.orders);
			expect(result.total).toBe(stateConnected.total);
		});

		test('should handle allFeedDisconnect', () => {
			const stateWithData = {
				...initialState,
				isConnected: true,
				isConnecting: false,
				orders: mockValidOrders,
				total: 50,
				totalToday: 5,
				error: 'Error',
			};

			const action = allFeedDisconnect();
			const result = allFeedReducer(stateWithData, action);

			// Test all fields that should be reset
			expect(result.isConnecting).toBe(false);
			expect(result.isConnected).toBe(false);
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.error).toBe(null);
		});

		test('should handle allFeedOpen', () => {
			const connectingState = {
				...initialState,
				isConnecting: true,
				error: 'Connection error',
			};

			const action = allFeedOpen();
			const result = allFeedReducer(connectingState, action);

			expect(result.isConnected).toBe(true);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe(null);

			expect(result.orders).toEqual(connectingState.orders);
			expect(result.total).toBe(connectingState.total);
		});

		test('should handle allFeedClose', () => {
			const connectedState = {
				...initialState,
				isConnected: true,
				isConnecting: true,
				error: 'Previous error',
			};

			const action = allFeedClose();
			const result = allFeedReducer(connectedState, action);

			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);

			expect(result.orders).toEqual(connectedState.orders);
			expect(result.error).toBe(connectedState.error); // error is preserved
		});

		test('should handle allFeedError', () => {
			const connectedState = {
				...initialState,
				isConnected: true,
				isConnecting: true,
			};

			const errorMessage = 'WebSocket connection failed';
			const action = allFeedError(errorMessage);
			const result = allFeedReducer(connectedState, action);

			// Test fields that should change
			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe(errorMessage);

			// Test fields that should NOT change
			expect(result.orders).toEqual(connectedState.orders);
			expect(result.total).toBe(connectedState.total);
		});
	});

	describe('allFeedMessage', () => {
		test('should handle message with valid orders', () => {
			const stateWithError = {
				...initialState,
				error: 'Old error',
			};

			const payload: AllOrdersMessage = {
				success: true,
				orders: mockValidOrders,
				total: 150,
				totalToday: 20,
			};

			const action = allFeedMessage(payload);
			const result = allFeedReducer(stateWithError, action);

			expect(result.orders).toEqual(mockValidOrders);
			expect(result.total).toBe(150);
			expect(result.totalToday).toBe(20);
			expect(result.error).toBe(null);

			expect(result.isConnecting).toBe(stateWithError.isConnecting);
			expect(result.isConnected).toBe(stateWithError.isConnected);
		});

		test('should filter out invalid orders', () => {
			const mixedOrders = [...mockValidOrders, ...mockInvalidOrders];

			const payload = {
				success: true,
				orders: mixedOrders,
				total: 100,
				totalToday: 10,
			} as unknown as AllOrdersMessage;

			const action = allFeedMessage(payload);
			const result = allFeedReducer(initialState, action);

			expect(result.orders).toEqual(mockValidOrders);
			expect(result.orders).toHaveLength(3); // Only valid orders
			expect(result.total).toBe(100);
			expect(result.totalToday).toBe(10);
		});

		test('should handle message with empty orders array', () => {
			const stateWithOrders = {
				...initialState,
				orders: mockValidOrders,
				total: 50,
			};

			const payload: AllOrdersMessage = {
				success: true,
				orders: [],
				total: 0,
				totalToday: 0,
			};

			const action = allFeedMessage(payload);
			const result = allFeedReducer(stateWithOrders, action);

			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.error).toBe(null);
		});

		test('should handle message with all invalid orders', () => {
			const payload = {
				success: true,
				orders: mockInvalidOrders,
				total: 50,
				totalToday: 5,
			} as unknown as AllOrdersMessage;

			const action = allFeedMessage(payload);
			const result = allFeedReducer(initialState, action);

			// Test that all invalid orders are filtered out
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(50);
			expect(result.totalToday).toBe(5);
		});
	});

	describe('order validation edge cases', () => {
		test('should handle orders with extra properties', () => {
			const orderWithExtraProps = {
				...mockValidOrders[0],
				extraField: 'should be ignored',
				anotherField: 123,
			};

			const payload: AllOrdersMessage = {
				success: true,
				orders: [orderWithExtraProps],
				total: 1,
				totalToday: 1,
			};

			const action = allFeedMessage(payload);
			const result = allFeedReducer(initialState, action);

			// Should accept order with extra properties
			expect(result.orders).toHaveLength(1);
			expect(result.orders[0]).toEqual(orderWithExtraProps);
		});

		test('should reject orders with wrong field types', () => {
			const invalidTypeOrder = {
				_id: 123, // Wrong- should be string
				status: 'done',
				number: 12345,
				createdAt: '2024-03-13T10:30:00.000Z',
				updatedAt: '2024-03-13T10:35:00.000Z',
				name: 'Test Order',
				ingredients: ['ingredient1'],
			};

			const payload = {
				success: true,
				orders: [invalidTypeOrder],
				total: 1,
				totalToday: 1,
			} as unknown as AllOrdersMessage;

			const action = allFeedMessage(payload);
			const result = allFeedReducer(initialState, action);

			// Should eliminate order with wrong field types
			expect(result.orders).toEqual([]);
		});
	});
});
