// Mock ingredients data
export const mockIngredients = [
	{
		_id: '1',
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
	},
	{
		_id: '2',
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
	},
	{
		_id: '3',
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
	},
];

// Mock state with loaded ingredients
export const mockStateWithIngredients = {
	ingredients: {
		items: mockIngredients,
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

// Mock state with loading
export const mockStateLoading = {
	ingredients: {
		items: [],
		isLoading: true,
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

// Mock state with error
export const mockStateWithError = {
	ingredients: {
		items: [],
		isLoading: false,
		hasError: true,
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
