import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	userFeedConnect,
	userFeedDisconnect,
	userFeedConnecting,
	userFeedOpen,
	userFeedClose,
	userFeedMessage,
	userFeedError,
} from './actions';
import { TFeedState } from '../ws-types';

// User feed specific state
interface TUserFeedState extends TFeedState {
	// user-specific properties
}

export const initialState: TUserFeedState = {
	orders: [],
	total: 0,
	totalToday: 0,
	isConnecting: true,
	isConnected: false,
	error: null,
};

export const userFeedSlice = createSlice({
	name: 'userFeed',
	initialState,
	reducers: {
		// Manual actions if needed
		clearUserFeed: (state) => {
			state.orders = [];
			state.total = 0;
			state.totalToday = 0;
			state.error = null;
		},
		clearUserFeedError: (state) => {
			state.error = null;
		},
	},
	selectors: {
		selectUserFeedOrders: (state) => state.orders,
		selectUserFeedTotal: (state) => state.total,
		selectUserFeedTotalToday: (state) => state.totalToday,
		selectUserFeedIsConnecting: (state) => state.isConnecting,
		selectUserFeedIsConnected: (state) => state.isConnected,
		selectUserFeedError: (state) => state.error,
	},
	extraReducers: (builder) => {
		builder
			.addCase(userFeedConnect, (state) => {
				state.error = null;
			})
			.addCase(userFeedConnecting, (state) => {
				state.isConnecting = true;
				state.isConnected = false;
				state.error = null;
			})
			.addCase(userFeedDisconnect, (state) => {
				state.isConnecting = false;
				state.isConnected = false;
				state.orders = [];
				state.total = 0;
				state.totalToday = 0;
				state.error = null;
			})
			.addCase(userFeedOpen, (state) => {
				state.isConnecting = false;
				state.isConnected = true;
				state.error = null;
			})
			.addCase(userFeedClose, (state) => {
				state.isConnecting = false;
				state.isConnected = false;
			})
			.addCase(userFeedError, (state, action: PayloadAction<string>) => {
				state.isConnecting = false;
				state.isConnected = false;
				state.error = action.payload;

				// Handle token error
				if (action.payload.includes('Invalid or missing token')) {
					state.error = 'Ошибка авторизации. Попробуйте перезайти в систему.';
				}
			})
			.addCase(userFeedMessage, (state, action) => {
				const { success, orders, total, totalToday, message } = action.payload;

				if (success && orders) {
					// Update orders data
					state.orders = orders;
					state.total = total || 0;
					state.totalToday = totalToday || 0;
					state.error = null;
				} else if (!success && message) {
					// Handle error messages from server
					state.error = message;

					// Handle token errors specifically
					if (message.includes('Invalid or missing token')) {
						state.error = 'Ошибка авторизации. Попробуйте перезайти в систему.';
					}
				}
			});
	},
});

export const { clearUserFeed, clearUserFeedError } = userFeedSlice.actions;

export const {
	selectUserFeedOrders,
	selectUserFeedTotal,
	selectUserFeedTotalToday,
	selectUserFeedIsConnecting,
	selectUserFeedIsConnected,
	selectUserFeedError,
} = userFeedSlice.selectors;

export default userFeedSlice.reducer;
