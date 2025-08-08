import { describe, test, expect, vi, beforeEach } from 'vitest';
import orderReducer, {
	createOrder,
	getOrderByNumber,
	clearOrder,
	initialState,
} from './orderSlice';
import { mockOrderData, mockCreateOrderResponse } from '../utils/mocks';

vi.mock('../../utils/api', () => ({
	ORDER_ENDPOINT: '/api/orders',
	fetchWithRefresh: vi.fn(),
	getOrderByNumberApi: vi.fn(),
}));

describe('orderSlice reducer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should return the initial state', () => {
		const result = orderReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	describe('clearOrder', () => {
		test('should clear order and error state', () => {
			const stateWithOrder = {
				...initialState,
				order: mockOrderData,
				hasError: true,
				error: 'Some error',
			};

			const action = clearOrder();
			const result = orderReducer(stateWithOrder, action);

			expect(result.order).toBe(null);
			expect(result.hasError).toBe(false);
			expect(result.error).toBe(null);

			// should NOT change!
			expect(result.isLoading).toBe(stateWithOrder.isLoading);
		});
	});

	describe('createOrder', () => {
		test('should handle createOrder.pending', () => {
			const action = { type: createOrder.pending.type };
			const result = orderReducer(initialState, action);

			expect(result.isLoading).toBe(true);
			expect(result.hasError).toBe(false);
			expect(result.error).toBe(null);
			expect(result.order).toBe(null);
		});

		test('should handle createOrder.fulfilled', () => {
			const loadingState = {
				...initialState,
				isLoading: true,
			};

			const action = {
				type: createOrder.fulfilled.type,
				payload: mockCreateOrderResponse,
			};

			const result = orderReducer(loadingState, action);

			expect(result.isLoading).toBe(false);
			expect(result.hasError).toBe(false);
			expect(result.error).toBe(null);
			expect(result.order).toEqual(mockOrderData);
		});

		test('should handle createOrder.rejected', () => {
			const loadingState = {
				...initialState,
				isLoading: true,
			};

			const errorMessage = 'Failed to create order';
			const action = {
				type: createOrder.rejected.type,
				payload: errorMessage,
			};

			const result = orderReducer(loadingState, action);

			expect(result.isLoading).toBe(false);
			expect(result.hasError).toBe(true);
			expect(result.error).toBe(errorMessage);
			expect(result.order).toBe(null);
		});
	});

	describe('getOrderByNumber', () => {
		test('should handle getOrderByNumber.pending', () => {
			const stateWithOrder = {
				...initialState,
				order: mockOrderData,
			};

			const action = { type: getOrderByNumber.pending.type };
			const result = orderReducer(stateWithOrder, action);

			expect(result.isLoading).toBe(true);
			expect(result.hasError).toBe(false);
			expect(result.error).toBe(null);

			// should NOT change
			expect(result.order).toEqual(stateWithOrder.order);
		});

		test('should handle getOrderByNumber.fulfilled', () => {
			const loadingState = {
				...initialState,
				isLoading: true,
			};

			const action = {
				type: getOrderByNumber.fulfilled.type,
				payload: mockOrderData,
			};

			const result = orderReducer(loadingState, action);

			expect(result.isLoading).toBe(false);
			expect(result.hasError).toBe(false);
			expect(result.error).toBe(null);
			expect(result.order).toEqual(mockOrderData);
		});

		test('should handle getOrderByNumber.rejected', () => {
			const loadingState = {
				...initialState,
				isLoading: true,
				order: mockOrderData,
			};

			const errorMessage = 'Order not found';
			const action = {
				type: getOrderByNumber.rejected.type,
				payload: errorMessage,
			};

			const result = orderReducer(loadingState, action);

			expect(result.isLoading).toBe(false);
			expect(result.hasError).toBe(true);
			expect(result.error).toBe(errorMessage);

			expect(result.order).toEqual(loadingState.order);
		});
	});

	describe('state transitions', () => {
		test('should handle createOrder success after previous error', () => {
			const errorState = {
				...initialState,
				hasError: true,
				error: 'Previous error',
			};

			const pendingAction = { type: createOrder.pending.type };
			const pendingResult = orderReducer(errorState, pendingAction);

			// error is cleared on pending
			expect(pendingResult.hasError).toBe(false);
			expect(pendingResult.error).toBe(null);
			expect(pendingResult.isLoading).toBe(true);

			const fulfilledAction = {
				type: createOrder.fulfilled.type,
				payload: mockCreateOrderResponse,
			};

			const fulfilledResult = orderReducer(pendingResult, fulfilledAction);

			//success completion
			expect(fulfilledResult.isLoading).toBe(false);
			expect(fulfilledResult.hasError).toBe(false);
			expect(fulfilledResult.order).toEqual(mockOrderData);
		});
	});
});
