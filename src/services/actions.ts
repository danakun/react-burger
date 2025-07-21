import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	loginRequest,
	registerRequest,
	logoutRequest,
	getUserRequest,
	updateUserRequest,
} from '../utils/api';
import type { TUserData, TAuthResponse } from '../utils/types';

// Helper function to save tokens
const saveTokens = (accessToken: string, refreshToken: string): void => {
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
};

// Helper function to clear tokens
const clearTokens = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
};

export const login = createAsyncThunk<
	TUserData,
	{ email: string; password: string }
>('user/login', async ({ email, password }) => {
	// Pass as object to match API function signature
	const data: TAuthResponse = await loginRequest({ email, password });
	saveTokens(data.accessToken, data.refreshToken);
	return data.user;
});

export const register = createAsyncThunk<
	TUserData,
	{ email: string; password: string; name: string }
>('user/register', async ({ email, password, name }) => {
	const data: TAuthResponse = await registerRequest({ email, password, name });
	saveTokens(data.accessToken, data.refreshToken);
	return data.user;
});

export const logout = createAsyncThunk('user/logout', async () => {
	await logoutRequest();
	clearTokens();
});

export const getUser = createAsyncThunk('user/getUser', async () => {
	const data = await getUserRequest();
	return data.user;
});

export const updateUser = createAsyncThunk<
	TUserData,
	TUserData & { password?: string }
>('user/updateUser', async (userData) => {
	const data = await updateUserRequest(userData);
	return data.user;
});

export const checkUserAuth = createAsyncThunk(
	'user/checkUserAuth',
	async () => {
		if (localStorage.getItem('accessToken')) {
			const data = await getUserRequest();
			return data.user;
		}
		return Promise.reject('No token');
	}
);

// import { createAsyncThunk } from '@reduxjs/toolkit';
// import {
// 	loginRequest,
// 	registerRequest,
// 	logoutRequest,
// 	getUserRequest,
// 	updateUserRequest,
// } from '../utils/api';

// // Helper function to save tokens
// const saveTokens = (accessToken, refreshToken) => {
// 	localStorage.setItem('accessToken', accessToken);
// 	localStorage.setItem('refreshToken', refreshToken);
// };

// // Helper function to clear tokens
// const clearTokens = () => {
// 	localStorage.removeItem('accessToken');
// 	localStorage.removeItem('refreshToken');
// };

// export const login = createAsyncThunk(
// 	'user/login',
// 	async ({ email, password }) => {
// 		const data = await loginRequest(email, password);
// 		saveTokens(data.accessToken, data.refreshToken);
// 		return data.user;
// 	}
// );

// export const register = createAsyncThunk(
// 	'user/register',
// 	async ({ email, password, name }) => {
// 		const data = await registerRequest(email, password, name);
// 		saveTokens(data.accessToken, data.refreshToken);
// 		return data.user;
// 	}
// );

// export const logout = createAsyncThunk('user/logout', async () => {
// 	await logoutRequest();
// 	clearTokens();
// });

// export const getUser = createAsyncThunk('user/getUser', async () => {
// 	const data = await getUserRequest();
// 	return data.user;
// });

// export const updateUser = createAsyncThunk(
// 	'user/updateUser',
// 	async ({ name, email, password }) => {
// 		const data = await updateUserRequest(name, email, password);
// 		return data.user;
// 	}
// );

// export const checkUserAuth = createAsyncThunk(
// 	'user/checkUserAuth',
// 	async () => {
// 		if (localStorage.getItem('accessToken')) {
// 			const data = await getUserRequest();
// 			return data.user;
// 		}
// 		return Promise.reject('No token');
// 	}
// );
