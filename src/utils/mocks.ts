import { vi } from 'vitest';
import type {
	TIngredientData,
	TConstructorIngredient,
	TOrderData,
} from './types';

// Mock ingredients data
export const mockBun: TIngredientData = {
	_id: '643d69a5c3f7b9001cfa093c',
	name: 'Краторная булка N-200i',
	type: 'bun',
	proteins: 80,
	fat: 24,
	carbohydrates: 53,
	calories: 420,
	price: 1255,
	image: 'https://code.s3.yandex.net/react/code/bun-02.png',
	image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
	image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
};

export const mockBun2: TIngredientData = {
	_id: '643d69a5c3f7b9001cfa093d',
	name: 'Флюоресцентная булка R2-D3',
	type: 'bun',
	proteins: 44,
	fat: 26,
	carbohydrates: 85,
	calories: 643,
	price: 988,
	image: 'https://code.s3.yandex.net/react/code/bun-01.png',
	image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
	image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
};

export const mockMainIngredient: TIngredientData = {
	_id: '643d69a5c3f7b9001cfa0941',
	name: 'Биокотлета из марсианской Магнолии',
	type: 'main',
	proteins: 420,
	fat: 142,
	carbohydrates: 242,
	calories: 4242,
	price: 424,
	image: 'https://code.s3.yandex.net/react/code/meat-01.png',
	image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
	image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
};

export const mockSauce: TIngredientData = {
	_id: '643d69a5c3f7b9001cfa093e',
	name: 'Соус Spicy-X',
	type: 'sauce',
	proteins: 30,
	fat: 20,
	carbohydrates: 40,
	calories: 30,
	price: 90,
	image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
	image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
	image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
};

// Mock constructor ingredients (with ingredientId)
export const mockConstructorBun: TConstructorIngredient = {
	...mockBun,
	ingredientId: 'mock-bun-id',
};

export const mockConstructorMain: TConstructorIngredient = {
	...mockMainIngredient,
	ingredientId: 'mock-main-id',
};

export const mockConstructorSauce: TConstructorIngredient = {
	...mockSauce,
	ingredientId: 'mock-sauce-id',
};

// Mock order data
export const mockOrderData: TOrderData = {
	_id: '65f123456789abcdef012345',
	status: 'done',
	name: 'Space Spicy Burger',
	createdAt: '2024-03-13T10:30:00.000Z',
	updatedAt: '2024-03-13T10:35:00.000Z',
	number: 12345,
	ingredients: [
		mockBun._id,
		mockMainIngredient._id,
		mockSauce._id,
		mockBun._id,
	],
};

export const mockCreateOrderResponse = {
	success: true,
	name: 'Space Spicy Burger',
	order: mockOrderData,
};

// Array of mock ingredients
export const mockIngredients: TIngredientData[] = [
	mockBun,
	mockBun2,
	mockMainIngredient,
	mockSauce,
];

// Valid orders for testing
export const mockValidOrders: TOrderData[] = [
	{
		_id: '65f123456789abcdef012345',
		status: 'done',
		name: 'Space Spicy Burger',
		createdAt: '2024-03-13T10:30:00.000Z',
		updatedAt: '2024-03-13T10:35:00.000Z',
		number: 12345,
		ingredients: [
			'643d69a5c3f7b9001cfa093c',
			'643d69a5c3f7b9001cfa0941',
			'643d69a5c3f7b9001cfa093e',
		],
	},
	{
		_id: '65f123456789abcdef012346',
		status: 'pending',
		name: 'Double Meat Burger',
		createdAt: '2024-03-13T11:00:00.000Z',
		updatedAt: '2024-03-13T11:05:00.000Z',
		number: 12346,
		ingredients: [
			'643d69a5c3f7b9001cfa093d',
			'643d69a5c3f7b9001cfa0941',
			'643d69a5c3f7b9001cfa0942',
		],
	},
	{
		_id: '65f123456789abcdef012347',
		status: 'created',
		name: 'Simple Sauce Burger',
		createdAt: '2024-03-13T12:00:00.000Z',
		updatedAt: '2024-03-13T12:01:00.000Z',
		number: 12347,
		ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093e'],
	},
];

// Mock orders for user feed tests
export const mockUserOrders: TOrderData[] = [
	{
		_id: '65f123456789abcdef012345',
		status: 'done',
		number: 12345,
		createdAt: '2024-03-13T10:30:00.000Z',
		updatedAt: '2024-03-13T10:35:00.000Z',
		name: 'Space Burger',
		ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
	},
	{
		_id: '65f123456789abcdef012346',
		status: 'pending',
		number: 12346,
		createdAt: '2024-03-13T11:30:00.000Z',
		updatedAt: '2024-03-13T11:35:00.000Z',
		name: 'Cosmic Spicy Burger',
		ingredients: ['643d69a5c3f7b9001cfa093e'],
	},
];

// Invalid orders
export const mockInvalidOrders = [
	// Missing _id
	{
		status: 'done',
		number: 1000,
		createdAt: '2024-03-13T10:30:00.000Z',
		updatedAt: '2024-03-13T10:35:00.000Z',
		name: 'Missing ID Order',
		ingredients: [],
	},
	// Wrong type for _id, should be string
	{
		_id: 123,
		status: 'done',
		number: 1001,
		createdAt: '2024-03-13T10:30:00.000Z',
		updatedAt: '2024-03-13T10:35:00.000Z',
		name: 'Wrong ID Type Order',
		ingredients: [],
	},
	// Wrong type for ingredients (string instead of array)
	{
		_id: 'invalid-3',
		status: 'done',
		number: 1002,
		createdAt: '2024-03-13T10:30:00.000Z',
		updatedAt: '2024-03-13T10:35:00.000Z',
		name: 'Wrong Ingredients Type Order',
		ingredients: 'not-an-array',
	},
	// Not an object at all
	null,
];
// Mock fetch helper
export const createMockFetch = (scenario: 'success' | 'network-error') => {
	switch (scenario) {
		case 'success':
			return vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ data: mockIngredients }),
			});
		case 'network-error':
			return vi.fn().mockRejectedValue(new Error('Network error'));
		default:
			return vi.fn();
	}
};
