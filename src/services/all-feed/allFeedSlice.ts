import { createSlice } from '@reduxjs/toolkit';
import {
	allFeedConnect,
	allFeedDisconnect,
	allFeedOpen,
	allFeedConnecting,
	allFeedClose,
	allFeedError,
	allFeedMessage,
} from './actions';
import type { TOrderData } from '../../utils/types';
import type { TFeedState } from '../ws-types';

// Initial state
export const initialState: TFeedState = {
	orders: [],
	total: 0,
	totalToday: 0,
	isConnecting: true,
	isConnected: false,
	error: null,
};

// Helper f to validate order data
const isValidOrder = (order: unknown): order is TOrderData => {
	if (!order || typeof order !== 'object') {
		return false;
	}

	const orderObj = order as Record<string, unknown>;

	return (
		typeof orderObj._id === 'string' &&
		typeof orderObj.number === 'number' &&
		typeof orderObj.status === 'string' &&
		Array.isArray(orderObj.ingredients) &&
		typeof orderObj.createdAt === 'string' &&
		typeof orderObj.updatedAt === 'string'
	);
};

// Create the slice
const allFeedSlice = createSlice({
	name: 'allFeed',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(allFeedConnect, (state) => {
				// Just initiate connection
				state.error = null;
			})
			.addCase(allFeedConnecting, (state) => {
				state.isConnecting = true;
				state.isConnected = false;
				state.error = null;
			})
			.addCase(allFeedDisconnect, (state) => {
				state.isConnecting = false;
				state.isConnected = false;
				state.orders = [];
				state.total = 0;
				state.totalToday = 0;
				state.error = null;
			})
			.addCase(allFeedOpen, (state) => {
				state.isConnecting = false;
				state.isConnected = true;
				state.error = null;
			})
			.addCase(allFeedClose, (state) => {
				state.isConnecting = false;
				state.isConnected = false;
			})
			.addCase(allFeedError, (state, action) => {
				state.isConnecting = false;
				state.isConnected = false;
				state.error = action.payload;
			})
			.addCase(allFeedMessage, (state, action) => {
				const validOrders = action.payload.orders.filter(isValidOrder);

				state.orders = validOrders;
				state.total = action.payload.total;
				state.totalToday = action.payload.totalToday;
				state.error = null;
			});
	},
});

// Selectors
export const selectAllFeedOrders = (state: { allFeed: TFeedState }) =>
	state.allFeed.orders;
export const selectAllFeedTotal = (state: { allFeed: TFeedState }) =>
	state.allFeed.total;
export const selectAllFeedTotalToday = (state: { allFeed: TFeedState }) =>
	state.allFeed.totalToday;
export const selectAllFeedIsConnected = (state: { allFeed: TFeedState }) =>
	state.allFeed.isConnected;
export const selectAllFeedIsConnecting = (state: { allFeed: TFeedState }) =>
	state.allFeed.isConnecting;
export const selectAllFeedError = (state: { allFeed: TFeedState }) =>
	state.allFeed.error;

// Helper selectors for status columns
export const selectDoneOrders = (state: { allFeed: TFeedState }) =>
	state.allFeed.orders.filter((order) => order.status === 'done').slice(0, 10);

export const selectPendingOrders = (state: { allFeed: TFeedState }) =>
	state.allFeed.orders
		.filter((order) => order.status === 'pending')
		.slice(0, 10);

export const selectCreatedOrders = (state: { allFeed: TFeedState }) =>
	state.allFeed.orders
		.filter((order) => order.status === 'created')
		.slice(0, 10);

// Helper to find order by number
export const selectOrderByNumber =
	(orderNumber: number) => (state: { allFeed: TFeedState }) =>
		state.allFeed.orders.find((order) => order.number === orderNumber);

export default allFeedSlice.reducer;
