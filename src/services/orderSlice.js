import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (ingredientIds, { rejectWithValue }) => {
		try {
			// Replace with your actual order endpoint
			const response = await fetch('YOUR_ORDER_ENDPOINT', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ingredients: ingredientIds }),
			});

			if (!response.ok) {
				throw new Error(`Failed with status: ${response.status}`);
			}

			const result = await response.json();
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
