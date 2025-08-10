import { describe, test, expect, vi, beforeEach } from 'vitest';
import constructorReducer, {
	addIngredient,
	removeIngredient,
	moveIngredient,
	clearConstructor,
	initialState,
} from './constructorSlice';
import {
	mockBun,
	mockBun2,
	mockMainIngredient,
	mockSauce,
	mockConstructorBun,
	mockConstructorMain,
	mockConstructorSauce,
} from '../utils/mocks';

// Mock nanoid
vi.mock('nanoid', () => ({
	nanoid: vi.fn(() => 'mocked-nanoid'),
}));

describe('constructorSlice reducer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should return the initial state', () => {
		const result = constructorReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	describe('addIngredient', () => {
		test('should add bun ingredient', () => {
			const action = addIngredient(mockBun);
			const result = constructorReducer(initialState, action);

			// Test fields that should change
			expect(result.bun).toEqual({
				...mockBun,
				ingredientId: 'mocked-nanoid',
			});

			// Test fields that should NOT change
			expect(result.ingredients).toEqual(initialState.ingredients);
		});

		test('should replace existing bun', () => {
			const stateWithBun = {
				...initialState,
				bun: mockConstructorBun,
			};

			const action = addIngredient(mockBun2);
			const result = constructorReducer(stateWithBun, action);

			// Test fields that should change
			expect(result.bun).toEqual({
				...mockBun2,
				ingredientId: 'mocked-nanoid',
			});

			// Test fields that should NOT change
			expect(result.ingredients).toEqual(stateWithBun.ingredients);
		});

		test('should add main ingredient to ingredients array', () => {
			const action = addIngredient(mockMainIngredient);
			const result = constructorReducer(initialState, action);

			// Test fields that should change
			expect(result.ingredients).toEqual([
				{
					...mockMainIngredient,
					ingredientId: 'mocked-nanoid',
				},
			]);

			// Test fields that should NOT change
			expect(result.bun).toEqual(initialState.bun);
		});

		test('should add sauce ingredient to ingredients array', () => {
			const action = addIngredient(mockSauce);
			const result = constructorReducer(initialState, action);

			// Test fields that should change
			expect(result.ingredients).toEqual([
				{
					...mockSauce,
					ingredientId: 'mocked-nanoid',
				},
			]);

			// Test fields that should NOT change
			expect(result.bun).toEqual(initialState.bun);
		});
	});

	describe('removeIngredient', () => {
		test('should remove ingredient by ingredientId', () => {
			const stateWithIngredients = {
				...initialState,
				ingredients: [mockConstructorMain, mockConstructorSauce],
			};

			const action = removeIngredient(mockConstructorMain.ingredientId);
			const result = constructorReducer(stateWithIngredients, action);

			// Test fields that should change
			expect(result.ingredients).toEqual([mockConstructorSauce]);

			// Test fields that should NOT change
			expect(result.bun).toEqual(stateWithIngredients.bun);
		});

		test('should not change state if ingredientId not found', () => {
			const stateWithIngredients = {
				...initialState,
				ingredients: [mockConstructorMain],
			};

			const action = removeIngredient('non-existent-id');
			const result = constructorReducer(stateWithIngredients, action);

			// Test fields that should NOT change
			expect(result.ingredients).toEqual(stateWithIngredients.ingredients);
			expect(result.bun).toEqual(stateWithIngredients.bun);
		});
	});

	describe('moveIngredient', () => {
		test('should move ingredient from one position to another', () => {
			const ingredient1 = { ...mockConstructorMain, ingredientId: 'id-1' };
			const ingredient2 = { ...mockConstructorSauce, ingredientId: 'id-2' };
			const ingredient3 = { ...mockConstructorMain, ingredientId: 'id-3' };

			const stateWithIngredients = {
				...initialState,
				ingredients: [ingredient1, ingredient2, ingredient3],
			};

			const action = moveIngredient({ dragIndex: 0, hoverIndex: 2 });
			const result = constructorReducer(stateWithIngredients, action);

			// Test fields that should change
			expect(result.ingredients).toEqual([
				ingredient2,
				ingredient3,
				ingredient1,
			]);

			// Test fields that should NOT change
			expect(result.bun).toEqual(stateWithIngredients.bun);
		});

		test('should move ingredient to earlier position', () => {
			const ingredient1 = { ...mockConstructorMain, ingredientId: 'id-1' };
			const ingredient2 = { ...mockConstructorSauce, ingredientId: 'id-2' };

			const stateWithIngredients = {
				...initialState,
				ingredients: [ingredient1, ingredient2],
			};

			const action = moveIngredient({ dragIndex: 1, hoverIndex: 0 });
			const result = constructorReducer(stateWithIngredients, action);

			// Test fields that should change
			expect(result.ingredients).toEqual([ingredient2, ingredient1]);

			// Test fields that should NOT change
			expect(result.bun).toEqual(stateWithIngredients.bun);
		});
	});

	describe('clearConstructor', () => {
		test('should clear all constructor data', () => {
			const stateWithData = {
				bun: mockConstructorBun,
				ingredients: [mockConstructorMain, mockConstructorSauce],
			};

			const action = clearConstructor();
			const result = constructorReducer(stateWithData, action);

			// Test fields that should change
			expect(result.bun).toBe(null);
			expect(result.ingredients).toEqual([]);
		});

		test('should not change already empty state', () => {
			const action = clearConstructor();
			const result = constructorReducer(initialState, action);

			// Test fields that should NOT change (already cleared)
			expect(result.bun).toBe(null);
			expect(result.ingredients).toEqual([]);
		});
	});
});
