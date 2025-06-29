import { createSlice } from '@reduxjs/toolkit';
import {
	login,
	logout,
	register,
	checkUserAuth,
	getUser,
	updateUser,
} from './actions';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		isAuthChecked: false,

		// Loading states
		loginRequest: false,
		registerRequest: false,
		logoutRequest: false,
		getUserRequest: false,
		updateUserRequest: false,

		// Error states
		loginFailed: false,
		registerFailed: false,
		logoutFailed: false,
		getUserFailed: false,
		updateUserFailed: false,
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setAuthChecked: (state, action) => {
			state.isAuthChecked = action.payload;
		},
		clearErrors: (state) => {
			state.loginFailed = false;
			state.registerFailed = false;
			state.logoutFailed = false;
			state.getUserFailed = false;
			state.updateUserFailed = false;
		},
	},
	selectors: {
		getUserData: (state) => state.user,
		getIsAuthChecked: (state) => state.isAuthChecked,
		getLoginRequest: (state) => state.loginRequest,
		getRegisterRequest: (state) => state.registerRequest,
		getLoginFailed: (state) => state.loginFailed,
		getRegisterFailed: (state) => state.registerFailed,
		getUpdateUserRequest: (state) => state.updateUserRequest,
		getUpdateUserFailed: (state) => state.updateUserFailed,
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(login.pending, (state) => {
				state.loginRequest = true;
				state.loginFailed = false;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loginRequest = false;
				state.loginFailed = false;
				state.user = action.payload;
				state.isAuthChecked = true;
			})
			.addCase(login.rejected, (state) => {
				state.loginRequest = false;
				state.loginFailed = true;
			})

			// Register
			.addCase(register.pending, (state) => {
				state.registerRequest = true;
				state.registerFailed = false;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.registerRequest = false;
				state.registerFailed = false;
				state.user = action.payload;
				state.isAuthChecked = true;
			})
			.addCase(register.rejected, (state) => {
				state.registerRequest = false;
				state.registerFailed = true;
			})

			// Logout
			.addCase(logout.pending, (state) => {
				state.logoutRequest = true;
				state.logoutFailed = false;
			})
			.addCase(logout.fulfilled, (state) => {
				state.logoutRequest = false;
				state.logoutFailed = false;
				state.user = null;
			})
			.addCase(logout.rejected, (state) => {
				state.logoutRequest = false;
				state.logoutFailed = true;
			})

			// Get User
			.addCase(getUser.pending, (state) => {
				state.getUserRequest = true;
				state.getUserFailed = false;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.getUserRequest = false;
				state.getUserFailed = false;
				state.user = action.payload;
			})
			.addCase(getUser.rejected, (state) => {
				state.getUserRequest = false;
				state.getUserFailed = true;
			})

			// Update User
			.addCase(updateUser.pending, (state) => {
				state.updateUserRequest = true;
				state.updateUserFailed = false;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.updateUserRequest = false;
				state.updateUserFailed = false;
				state.user = action.payload;
			})
			.addCase(updateUser.rejected, (state) => {
				state.updateUserRequest = false;
				state.updateUserFailed = true;
			})

			// Check User Auth
			.addCase(checkUserAuth.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isAuthChecked = true;
			})
			.addCase(checkUserAuth.rejected, (state) => {
				state.user = null;
				state.isAuthChecked = true;
			});
	},
});

export const { setUser, setAuthChecked, clearErrors } = userSlice.actions;
export const {
	getUserData,
	getIsAuthChecked,
	getLoginRequest,
	getRegisterRequest,
	getLoginFailed,
	getRegisterFailed,
	getUpdateUserRequest,
	getUpdateUserFailed,
} = userSlice.selectors;
export default userSlice.reducer;
