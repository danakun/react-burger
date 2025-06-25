// Base URL
import { API_BASE_URL } from './constants';

export const INGREDIENTS_ENDPOINT = `${API_BASE_URL}/api/ingredients`;
export const ORDER_ENDPOINT = `${API_BASE_URL}/api/orders`;

export const PASSWORD_RESET_ENDPOINT = `${API_BASE_URL}/api/password-reset`;
export const PASSWORD_RESET_CONFIRM_ENDPOINT = `${API_BASE_URL}/api/password-reset/reset`;
export const AUTH_REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/register`;
export const AUTH_LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`;
export const AUTH_LOGOUT_ENDPOINT = `${API_BASE_URL}/api/auth/logout`;
export const AUTH_TOKEN_ENDPOINT = `${API_BASE_URL}/api/auth/token`;
export const AUTH_USER_ENDPOINT = `${API_BASE_URL}/api/auth/user`;

// Функция для обработки ответа
export const checkResponse = (res) => {
	return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

// Функция для обновления токена
export const refreshToken = () => {
	return fetch(AUTH_TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	})
		.then(checkResponse)
		.then((refreshData) => {
			if (!refreshData.success) {
				return Promise.reject(refreshData);
			}
			localStorage.setItem('refreshToken', refreshData.refreshToken);
			localStorage.setItem('accessToken', refreshData.accessToken);
			return refreshData;
		});
};

// Функция для запроса с обновлением токена
export const fetchWithRefresh = async (url, options) => {
	try {
		const res = await fetch(url, options);
		return await checkResponse(res);
	} catch (err) {
		if (err.message === 'jwt expired') {
			const refreshData = await refreshToken();
			options.headers.authorization = refreshData.accessToken;
			const res = await fetch(url, options);
			return await checkResponse(res);
		} else {
			return Promise.reject(err);
		}
	}
};

// API функции для аутентификации
export const registerRequest = (email, password, name) => {
	return fetch(AUTH_REGISTER_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			email,
			password,
			name,
		}),
	}).then(checkResponse);
};

export const loginRequest = (email, password) => {
	return fetch(AUTH_LOGIN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			email,
			password,
		}),
	}).then(checkResponse);
};

export const logoutRequest = () => {
	return fetch(AUTH_LOGOUT_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	}).then(checkResponse);
};

export const getUserRequest = () => {
	return fetchWithRefresh(AUTH_USER_ENDPOINT, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken'),
		},
	});
};

export const updateUserRequest = (name, email, password) => {
	return fetchWithRefresh(AUTH_USER_ENDPOINT, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken'),
		},
		body: JSON.stringify({
			name,
			email,
			...(password && { password }),
		}),
	});
};

// Password reset API functions (no Redux needed)
export const forgotPasswordRequest = (email) => {
	return fetch(PASSWORD_RESET_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ email }),
	}).then(checkResponse);
};

export const resetPasswordRequest = (password, token) => {
	return fetch(PASSWORD_RESET_CONFIRM_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ password, token }),
	}).then(checkResponse);
};

export const createOrderRequest = (ingredients) => {
	return fetchWithRefresh(ORDER_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken'),
		},
		body: JSON.stringify({ ingredients }),
	});
};
