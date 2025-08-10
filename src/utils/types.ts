// Base API Response
export type TApiResponse<T = unknown> = {
	success: boolean;
	data?: T;
	message?: string;
};

// Core Data Types
export type TUserData = {
	email: string;
	name: string;
};

export type TIngredientData = {
	_id: string;
	name: string;
	type: 'bun' | 'sauce' | 'main';
	proteins: number;
	fat: number;
	carbohydrates: number;
	calories: number;
	price: number;
	image: string;
	image_mobile: string;
	image_large: string;
};

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TOrderData = {
	_id: string;
	status: TOrderStatus;
	number: number;
	createdAt: string;
	updatedAt: string;
	name: string;
	ingredients: string[];
};

// Auth Related Types
export type TAuthResponse = {
	success: boolean;
	accessToken: string;
	refreshToken: string;
	user: TUserData;
};

export type TUserResponse = {
	success: boolean;
	user: TUserData;
};

export type TRefreshTokenResponse = {
	success: boolean;
	refreshToken: string;
	accessToken: string;
};

// API Response Types
export type TIngredientsResponse = TApiResponse<TIngredientData[]>;

export type TOrderResponse = TApiResponse<{
	order: TOrderData;
}>;

// Request Options
export type TRequestOptions = RequestInit & {
	headers?: Record<string, string>;
};

// Redux State Types (for when you're ready to type Redux)
export type TIngredientsState = {
	items: TIngredientData[];
	itemsMap: Record<string, TIngredientData>;
	isLoading: boolean;
	hasError: boolean;
	error: string | null;
};

export type TUserState = {
	user: TUserData | null;
	isAuthenticated: boolean;
	loginRequest: boolean;
	loginFailed: boolean;
	registerRequest: boolean;
	registerFailed: boolean;
	accessToken?: string;
	refreshToken?: string;
};

export type TConstructorState = {
	bun: TIngredientData | null;
	ingredients: TConstructorIngredient[];
};

export type TConstructorIngredient = TIngredientData & {
	ingredientId: string; // Unique ID for constructor items (nanoid)
};

export type TOrderState = {
	orderRequest: boolean;
	orderFailed: boolean;
	orderNumber: number | null;
};

export type TFeedState = {
	orders: TOrderData[];
	total: number;
	totalToday: number;
	isConnecting: boolean;
	isConnected: boolean;
	error: string | null;
};

export type TAllFeedMessage = {
	success: boolean;
	orders: TOrderData[];
	total: number;
	totalToday: number;
};

export type TUserFeedMessage = {
	success: boolean;
	orders: TOrderData[];
	total: number;
	totalToday: number;
};

export type TApiError = {
	message: string;
	status?: number;
};
