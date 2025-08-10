import { API_BASE_URL } from './constants.ts';

import type {
	TApiResponse,
	TAuthResponse,
	TUserResponse,
	TRefreshTokenResponse,
	TIngredientsResponse,
	TOrderResponse,
	TRequestOptions,
	TUserData,
	TApiError,
	TOrderData,
} from '@utils/types';

// Endpoints
export const INGREDIENTS_ENDPOINT = `${API_BASE_URL}/api/ingredients`;
export const ORDER_ENDPOINT = `${API_BASE_URL}/api/orders`;
export const PASSWORD_RESET_ENDPOINT = `${API_BASE_URL}/api/password-reset`;
export const PASSWORD_RESET_CONFIRM_ENDPOINT = `${API_BASE_URL}/api/password-reset/reset`;
export const AUTH_REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/register`;
export const AUTH_LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`;
export const AUTH_LOGOUT_ENDPOINT = `${API_BASE_URL}/api/auth/logout`;
export const AUTH_TOKEN_ENDPOINT = `${API_BASE_URL}/api/auth/token`;
export const AUTH_USER_ENDPOINT = `${API_BASE_URL}/api/auth/user`;

// Handling the response utility function
export const checkResponse = <T>(res: Response): Promise<T> => {
	return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

// Request utility function
function request<T = unknown>(
	url: string,
	options?: TRequestOptions
): Promise<T> {
	return fetch(url, options).then(checkResponse<T>);
}

// Функция для обновления токена
export const refreshToken = (): Promise<TRefreshTokenResponse> => {
	return request<TRefreshTokenResponse>(AUTH_TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	}).then((refreshData) => {
		if (!refreshData.success) {
			return Promise.reject(refreshData);
		}
		localStorage.setItem('refreshToken', refreshData.refreshToken);
		localStorage.setItem('accessToken', refreshData.accessToken);
		return refreshData;
	});
};

// Fetch function with token refresh
export const fetchWithRefresh = async <T>(
	url: string,
	options: TRequestOptions
): Promise<T> => {
	try {
		return await request<T>(url, options);
	} catch (err: unknown) {
		const error = err as TApiError;
		if (error.message === 'jwt expired') {
			const refreshData = await refreshToken();
			if (!options.headers) {
				options.headers = {};
			}
			options.headers.authorization = refreshData.accessToken;
			return await request<T>(url, options);
		} else {
			return Promise.reject(err);
		}
	}
};

// API function for authentication
export const registerRequest = ({
	email,
	password,
	name,
}: TUserData & { password: string }): Promise<TAuthResponse> => {
	return request<TAuthResponse>(AUTH_REGISTER_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			email,
			password,
			name,
		}),
	});
};

export const loginRequest = ({
	email,
	password,
}: Pick<TUserData, 'email'> & { password: string }): Promise<TAuthResponse> => {
	return request<TAuthResponse>(AUTH_LOGIN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});
};

export const logoutRequest = (): Promise<TApiResponse> => {
	return request<TApiResponse>(AUTH_LOGOUT_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	});
};

export const getUserRequest = (): Promise<TUserResponse> => {
	return fetchWithRefresh<TUserResponse>(AUTH_USER_ENDPOINT, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken') || '',
		},
	});
};

export const updateUserRequest = ({
	name,
	email,
	password,
}: TUserData & { password?: string }): Promise<TUserResponse> => {
	return fetchWithRefresh<TUserResponse>(AUTH_USER_ENDPOINT, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken') || '',
		},
		body: JSON.stringify({
			name,
			email,
			...(password && { password }),
		}),
	});
};

// Password reset API functions
export const forgotPasswordRequest = ({
	email,
}: Pick<TUserData, 'email'>): Promise<TApiResponse> => {
	return request<TApiResponse>(PASSWORD_RESET_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ email }),
	});
};

export const resetPasswordRequest = (
	password: string,
	token: string
): Promise<TApiResponse> => {
	return request<TApiResponse>(PASSWORD_RESET_CONFIRM_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ password, token }),
	});
};

export const createOrderRequest = (
	ingredients: Array<string>
): Promise<TOrderResponse> => {
	return fetchWithRefresh<TOrderResponse>(ORDER_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken') || '',
		},
		body: JSON.stringify({ ingredients }),
	});
};

export const getOrderByNumberApi = async (
	orderNumber: number
): Promise<{ orders: TOrderData[] }> => {
	return request<{ orders: TOrderData[] }>(`${ORDER_ENDPOINT}/${orderNumber}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
	});
};

// Ingredients API function
export const getIngredientsRequest = (): Promise<TIngredientsResponse> => {
	return request<TIngredientsResponse>(INGREDIENTS_ENDPOINT, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
	});
};

// export const getOrderByNumberApi = async (
// 	orderNumber: number
// ): Promise<TOrderResponse> => {
// 	return fetchWithRefresh<TOrderResponse>(`${ORDER_ENDPOINT}/${orderNumber}`, {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json;charset=utf-8',
// 			authorization: localStorage.getItem('accessToken') || '',
// 		},
// 	});
// };
