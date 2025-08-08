import { describe, it, expect, vi, beforeEach } from 'vitest';
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

	it('should return the initial state when called with undefined state', () => {
		const result = allFeedReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	describe('WebSocket connection lifecycle management', () => {
		it('should clear existing errors when initiating connection', () => {
			const stateWithError = {
				...initialState,
				error: 'Previous error',
			};

			const action = allFeedConnect('ws://localhost:3001');
			const result = allFeedReducer(stateWithError, action);

			// Should clear error on connection attempt
			expect(result.error).toBe(null);

			// Should not change connection state or data yet
			expect(result.isConnecting).toBe(stateWithError.isConnecting);
			expect(result.isConnected).toBe(stateWithError.isConnected);
			expect(result.orders).toEqual(stateWithError.orders);
		});

		it('should set connecting state and clear previous connection', () => {
			const stateConnected = {
				...initialState,
				isConnecting: false,
				isConnected: true,
				error: 'Some error',
			};

			const action = allFeedConnecting();
			const result = allFeedReducer(stateConnected, action);

			// Should update connection state and clear error
			expect(result.isConnecting).toBe(true);
			expect(result.isConnected).toBe(false);
			expect(result.error).toBe(null);

			// Should preserve existing data
			expect(result.orders).toEqual(stateConnected.orders);
			expect(result.total).toBe(stateConnected.total);
		});

		it('should reset all state to initial values when disconnecting', () => {
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

			// Should reset everything to initial state
			expect(result.isConnecting).toBe(false);
			expect(result.isConnected).toBe(false);
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.error).toBe(null);
		});

		it('should mark connection as established when WebSocket opens', () => {
			const connectingState = {
				...initialState,
				isConnecting: true,
				error: 'Connection error',
			};

			const action = allFeedOpen();
			const result = allFeedReducer(connectingState, action);

			// Should establish connection and clear errors
			expect(result.isConnected).toBe(true);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe(null);

			// Should preserve existing data
			expect(result.orders).toEqual(connectingState.orders);
			expect(result.total).toBe(connectingState.total);
		});

		it('should mark connection as closed while preserving data and errors', () => {
			const connectedState = {
				...initialState,
				isConnected: true,
				isConnecting: true,
				error: 'Previous error',
			};

			const action = allFeedClose();
			const result = allFeedReducer(connectedState, action);

			// Should close connection
			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);

			// Should preserve data and error state
			expect(result.orders).toEqual(connectedState.orders);
			expect(result.error).toBe(connectedState.error);
		});

		it('should handle WebSocket errors by closing connection and setting error message', () => {
			const connectedState = {
				...initialState,
				isConnected: true,
				isConnecting: true,
			};

			const errorMessage = 'WebSocket connection failed';
			const action = allFeedError(errorMessage);
			const result = allFeedReducer(connectedState, action);

			// Should close connection and set error
			expect(result.isConnected).toBe(false);
			expect(result.isConnecting).toBe(false);
			expect(result.error).toBe(errorMessage);

			// Should preserve existing data
			expect(result.orders).toEqual(connectedState.orders);
			expect(result.total).toBe(connectedState.total);
		});
	});

	describe('message processing and order validation', () => {
		it('should update state with valid orders from successful message', () => {
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

			// Should update with new data and clear errors
			expect(result.orders).toEqual(mockValidOrders);
			expect(result.total).toBe(150);
			expect(result.totalToday).toBe(20);
			expect(result.error).toBe(null);

			// Should preserve connection state
			expect(result.isConnecting).toBe(stateWithError.isConnecting);
			expect(result.isConnected).toBe(stateWithError.isConnected);
		});

		it('should filter out invalid orders while keeping valid ones', () => {
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

		it('should handle empty orders array by clearing existing orders', () => {
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

			// Should clear all data
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalToday).toBe(0);
			expect(result.error).toBe(null);
		});

		it('should result in empty orders array when all orders are invalid', () => {
			const payload = {
				success: true,
				orders: mockInvalidOrders,
				total: 50,
				totalToday: 5,
			} as unknown as AllOrdersMessage;

			const action = allFeedMessage(payload);
			const result = allFeedReducer(initialState, action);

			// Should filter out all invalid orders
			expect(result.orders).toEqual([]);
			expect(result.total).toBe(50);
			expect(result.totalToday).toBe(5);
		});
	});

	describe('order validation edge cases', () => {
		it('should accept orders with extra properties beyond required fields', () => {
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

		it('should reject orders with incorrect field data types', () => {
			const invalidTypeOrder = {
				_id: 123, // Wrong type - should be string
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

			// Should reject order with wrong field types
			expect(result.orders).toEqual([]);
		});
	});
});
