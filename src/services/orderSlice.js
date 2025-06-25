import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_ENDPOINT } from '../utils/constants';
import { fetchWithRefresh } from '../utils/api';

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (ingredientIds, { rejectWithValue }) => {
		try {
			const result = await fetchWithRefresh(ORDER_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					authorization: localStorage.getItem('accessToken'),
				},
				body: JSON.stringify({ ingredients: ingredientIds }),
			});

			return result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
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
				state.order = action.payload;
				state.error = null;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.hasError = true;
				state.error = action.payload;
				state.order = null;
			});
	},
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
