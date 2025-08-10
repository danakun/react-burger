import { describe, test, expect, vi, beforeEach } from 'vitest';
import ingredientsReducer, {
	fetchIngredients,
	initialState,
} from './ingredientsSlice';
import { mockIngredients } from '../utils/mocks';

// Mock fetch globally
global.fetch = vi.fn();

// Mock API
vi.mock('../../utils/api', () => ({
	checkResponse: vi.fn((response) => response.json()),
}));

describe('ingredientsSlice reducer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should return the initial state', () => {
		const result = ingredientsReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	test('should handle fetchIngredients.pending', () => {
		const action = { type: fetchIngredients.pending.type };
		const result = ingredientsReducer(initialState, action);

		//  fields that should change
		expect(result.isLoading).toBe(true);
		expect(result.hasError).toBe(false);
		expect(result.error).toBe(null);

		// fields that should NOT change
		expect(result.items).toEqual(initialState.items);
		expect(result.itemsMap).toEqual(initialState.itemsMap);
	});

	test('should handle fetchIngredients.fulfilled', () => {
		const prevState = {
			...initialState,
			isLoading: true,
		};

		const action = {
			type: fetchIngredients.fulfilled.type,
			payload: mockIngredients,
		};

		const result = ingredientsReducer(prevState, action);

		// should change
		expect(result.isLoading).toBe(false);
		expect(result.hasError).toBe(false);
		expect(result.error).toBe(null);
		expect(result.items).toEqual(mockIngredients);
		expect(result.itemsMap).toEqual({
			[mockIngredients[0]._id]: mockIngredients[0],
			[mockIngredients[1]._id]: mockIngredients[1],
			[mockIngredients[2]._id]: mockIngredients[2],
			[mockIngredients[3]._id]: mockIngredients[3],
		});
	});

	test('should handle fetchIngredients.rejected', () => {
		const prevState = {
			...initialState,
			isLoading: true,
			items: mockIngredients,
			itemsMap: { [mockIngredients[0]._id]: mockIngredients[0] },
		};

		const errorMessage = 'Network error';
		const action = {
			type: fetchIngredients.rejected.type,
			payload: errorMessage,
		};

		const result = ingredientsReducer(prevState, action);

		// should change
		expect(result.isLoading).toBe(false);
		expect(result.hasError).toBe(true);
		expect(result.error).toBe(errorMessage);
		expect(result.items).toEqual([]);
		expect(result.itemsMap).toEqual({});
	});
});
