import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	ORDER_ENDPOINT,
	fetchWithRefresh,
	getOrderByNumberApi,
} from '../utils/api';
import type { TOrderData } from '../utils/types';

type TCreateOrderResponse = {
	success: boolean;
	name: string;
	order: TOrderData;
};

// State type
type TOrderState = {
	order: TOrderData | null;
	isLoading: boolean;
	hasError: boolean;
	error: string | null;
};

export const createOrder = createAsyncThunk<
	TCreateOrderResponse, // Return type (what the API gives us)
	string[] // Argument type (ingredient IDs)
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
	try {
		const result = await fetchWithRefresh<TCreateOrderResponse>(
			ORDER_ENDPOINT,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					authorization: localStorage.getItem('accessToken') || '',
				},
				body: JSON.stringify({ ingredients: ingredientIds }),
			}
		);
		return result;
	} catch (error) {
		return rejectWithValue(
			error instanceof Error ? error.message : 'Unknown error'
		);
	}
});

export const getOrderByNumber = createAsyncThunk<TOrderData, number>(
	'order/getOrderByNumber',
	async (orderNumber, { rejectWithValue }) => {
		try {
			const result = await getOrderByNumberApi(orderNumber);
			if (!result.data?.order) {
				return rejectWithValue('Order not found');
			}
			return result.data.order;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Order not found'
			);
		}
	}
);

const initialState: TOrderState = {
	order: null,
	isLoading: false,
	hasError: false,
	error: null,
};

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		clearOrder: (state) => {
			state.order = null;
			state.hasError = false;
			state.error = null;
		},
	},
	selectors: {
		getOrder: (state) => state.order,
		getIsLoading: (state) => state.isLoading,
		getHasError: (state) => state.hasError,
		getError: (state) => state.error,
		getOrderNumber: (state) => state.order?.number || null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.isLoading = true;
				state.hasError = false;
				state.error = null;
				state.order = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.hasError = false;
				state.order = action.payload.order; // Extract the nested order
				state.error = null;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.hasError = true;
				state.error = action.payload as string;
				state.order = null;
			});
	},
});

export const { clearOrder } = orderSlice.actions;

// Export action types
type TOrderActionCreators = typeof orderSlice.actions;
export type TOrderActions = ReturnType<
	TOrderActionCreators[keyof TOrderActionCreators]
>;

// Export selectors
export const { getOrder, getIsLoading, getHasError, getError, getOrderNumber } =
	orderSlice.selectors;

export default orderSlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import {
// 	ORDER_ENDPOINT,
// 	fetchWithRefresh,
// 	getOrderByNumberApi,
// } from '../utils/api';
// import type { TOrderData, TOrderResponse } from '../utils/types';

// // State type
// type TOrderState = {
// 	order: TOrderData | null;
// 	isLoading: boolean;
// 	hasError: boolean;
// 	error: string | null;
// 	// For the new getOrderByNumber functionality
// 	fetchingByNumber: boolean;
// 	fetchByNumberError: string | null;
// };

// export const createOrder = createAsyncThunk<TOrderData, string[]>(
// 	'order/createOrder',
// 	async (ingredientIds, { rejectWithValue }) => {
// 		try {
// 			const result = await fetchWithRefresh<TOrderResponse>(ORDER_ENDPOINT, {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json;charset=utf-8',
// 					authorization: localStorage.getItem('accessToken') || '',
// 				},
// 				body: JSON.stringify({ ingredients: ingredientIds }),
// 			});

// 			return result.data.order;
// 		} catch (error) {
// 			return rejectWithValue(
// 				error instanceof Error ? error.message : 'Unknown error'
// 			);
// 		}
// 	}
// );

// export const getOrderByNumber = createAsyncThunk<TOrderData, number>(
// 	'order/getOrderByNumber',
// 	async (orderNumber, { rejectWithValue }) => {
// 		try {
// 			const result = await getOrderByNumberApi(orderNumber);
// 			return result.data.order;
// 		} catch (error) {
// 			return rejectWithValue(
// 				error instanceof Error ? error.message : 'Order not found'
// 			);
// 		}
// 	}
// );

// const initialState: TOrderState = {
// 	order: null,
// 	isLoading: false,
// 	hasError: false,
// 	error: null,
// 	fetchingByNumber: false,
// 	fetchByNumberError: null,
// };

// const orderSlice = createSlice({
// 	name: 'order',
// 	initialState,
// 	reducers: {
// 		clearOrder: (state) => {
// 			state.order = null;
// 			state.hasError = false;
// 			state.error = null;
// 			state.fetchByNumberError = null;
// 		},
// 		clearErrors: (state) => {
// 			state.hasError = false;
// 			state.error = null;
// 			state.fetchByNumberError = null;
// 		},
// 	},
// 	selectors: {
// 		getOrder: (state) => state.order,
// 		getIsLoading: (state) => state.isLoading,
// 		getHasError: (state) => state.hasError,
// 		getError: (state) => state.error,
// 		getIsFetchingByNumber: (state) => state.fetchingByNumber,
// 		getFetchByNumberError: (state) => state.fetchByNumberError,
// 	},
// 	extraReducers: (builder) => {
// 		builder
// 			// Create Order
// 			.addCase(createOrder.pending, (state) => {
// 				state.isLoading = true;
// 				state.hasError = false;
// 				state.error = null;
// 				state.order = null;
// 			})
// 			.addCase(createOrder.fulfilled, (state, action) => {
// 				state.isLoading = false;
// 				state.hasError = false;
// 				state.order = action.payload;
// 				state.error = null;
// 			})
// 			.addCase(createOrder.rejected, (state, action) => {
// 				state.isLoading = false;
// 				state.hasError = true;
// 				state.error = action.payload as string;
// 				state.order = null;
// 			})

// 			// Get Order By Number
// 			.addCase(getOrderByNumber.pending, (state) => {
// 				state.fetchingByNumber = true;
// 				state.fetchByNumberError = null;
// 			})
// 			.addCase(getOrderByNumber.fulfilled, (state, action) => {
// 				state.fetchingByNumber = false;
// 				state.order = action.payload;
// 				state.fetchByNumberError = null;
// 			})
// 			.addCase(getOrderByNumber.rejected, (state, action) => {
// 				state.fetchingByNumber = false;
// 				state.fetchByNumberError = action.payload as string;
// 			});
// 	},
// });

// export const { clearOrder, clearErrors } = orderSlice.actions;

// // Export action types
// type TOrderActionCreators = typeof orderSlice.actions;
// export type TOrderActions = ReturnType<
// 	TOrderActionCreators[keyof TOrderActionCreators]
// >;

// export const {
// 	getOrder,
// 	getIsLoading,
// 	getHasError,
// 	getError,
// 	getIsFetchingByNumber,
// 	getFetchByNumberError,
// } = orderSlice.selectors;

// export default orderSlice.reducer;
