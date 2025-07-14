import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INGREDIENTS_ENDPOINT } from '../utils/constants';
import { checkResponse } from '../utils/api';
import type { TIngredientData } from '../utils/types';

interface IngredientsState {
	items: TIngredientData[];
	isLoading: boolean;
	hasError: boolean;
	error: string | null;
}

export const fetchIngredients = createAsyncThunk<TIngredientData[], void>(
	'ingredients/fetchIngredients',
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch(INGREDIENTS_ENDPOINT);
			const result = await checkResponse<{ data: TIngredientData[] }>(response);
			return result.data || [];
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : 'Unknown error'
			);
		}
	}
);

const initialState: IngredientsState = {
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
				state.error = action.payload as string;
				state.items = [];
			});
	},
});

export default ingredientsSlice.reducer;
