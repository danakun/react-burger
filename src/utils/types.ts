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
	__v: number;
};

export type TOrderData = {
	_id: string;
	status: string;
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
	isLoading: boolean;
	hasError: boolean;
};

export type TUserState = {
	user: TUserData | null;
	isAuthenticated: boolean;
	loginRequest: boolean;
	loginFailed: boolean;
	registerRequest: boolean;
	registerFailed: boolean;
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

export type TApiError = {
	message: string;
	status?: number;
};
