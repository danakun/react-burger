import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INGREDIENTS_ENDPOINT } from '../utils/constants.js';
import { checkResponse } from '../utils/api.js';

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch(INGREDIENTS_ENDPOINT);
			const result = await checkResponse(response);
			return result.data || [];
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	items: [],
	isLoading: false,
	hasError: false,
	error: null,
};

const ingredientsSlice = createSlice({
	name: 'ingredients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.isLoading = true;
				state.hasError = false;
				state.error = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action) => {
				state.isLoading = false;
				state.hasError = false;
				state.items = action.payload;
				state.error = null;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.isLoading = false;
				state.hasError = true;
				state.error = action.payload;
				state.items = [];
			});
	},
});

export default ingredientsSlice.reducer;
