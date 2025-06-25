import { API_BASE_URL } from './constants';

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

// Функция для обработки ответа
export const checkResponse = (res) => {
	return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

// Универсальная функция запроса
function request(url, options) {
	return fetch(url, options).then(checkResponse);
}

// Функция для обновления токена
export const refreshToken = () => {
	return request(AUTH_TOKEN_ENDPOINT, {
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

// Функция для запроса с обновлением токена
export const fetchWithRefresh = async (url, options) => {
	try {
		return await request(url, options);
	} catch (err) {
		if (err.message === 'jwt expired') {
			const refreshData = await refreshToken();
			options.headers.authorization = refreshData.accessToken;
			return await request(url, options);
		} else {
			return Promise.reject(err);
		}
	}
};

// API функции для аутентификации
export const registerRequest = (email, password, name) => {
	return request(AUTH_REGISTER_ENDPOINT, {
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

export const loginRequest = (email, password) => {
	return request(AUTH_LOGIN_ENDPOINT, {
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

export const logoutRequest = () => {
	return request(AUTH_LOGOUT_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	});
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
	return request(PASSWORD_RESET_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ email }),
	});
};

export const resetPasswordRequest = (password, token) => {
	return request(PASSWORD_RESET_CONFIRM_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ password, token }),
	});
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

// Ingredients API function
export const getIngredientsRequest = () => {
	return request(INGREDIENTS_ENDPOINT, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
	});
};
