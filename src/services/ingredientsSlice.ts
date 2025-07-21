import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INGREDIENTS_ENDPOINT } from '../utils/constants';
import { checkResponse } from '../utils/api';
import type { TIngredientData } from '../utils/types';

interface IngredientsState {
	items: TIngredientData[];
	itemsMap: Record<string, TIngredientData>; // For fast lookup by ID (requirement #5)
	isLoading: boolean;
	hasError: boolean;
	error: string | null;
}

export const fetchIngredients = createAsyncThunk(
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
	itemsMap: {}, // Initialize empty map
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

				// Create map for fast lookup (requirement #5)
				state.itemsMap = action.payload.reduce(
					(map, ingredient) => {
						map[ingredient._id] = ingredient;
						return map;
					},
					{} as Record<string, TIngredientData>
				);

				state.error = null;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.isLoading = false;
				state.hasError = true;
				state.error = action.payload as string;
				state.items = [];
				state.itemsMap = {}; // Clear map on error
			});
	},
});

// Selectors
export const selectIngredients = (state: { ingredients: IngredientsState }) =>
	state.ingredients.items;

export const selectIngredientsMap = (state: {
	ingredients: IngredientsState;
}) => state.ingredients.itemsMap;

export const selectIngredientsLoading = (state: {
	ingredients: IngredientsState;
}) => state.ingredients.isLoading;

export const selectIngredientsError = (state: {
	ingredients: IngredientsState;
}) => state.ingredients.hasError;

export const selectIngredientsErrorMessage = (state: {
	ingredients: IngredientsState;
}) => state.ingredients.error;

// Helper selector to get ingredient by ID (using the fast lookup map)
export const selectIngredientById =
	(id: string) => (state: { ingredients: IngredientsState }) =>
		state.ingredients.itemsMap[id];

// Helper selector to get ingredients by type
export const selectIngredientsByType =
	(type: string) => (state: { ingredients: IngredientsState }) =>
		state.ingredients.items.filter((ingredient) => ingredient.type === type);

// Helper selector to get multiple ingredients by IDs
export const selectIngredientsByIds =
	(ids: string[]) => (state: { ingredients: IngredientsState }) =>
		ids.map((id) => state.ingredients.itemsMap[id]).filter(Boolean);

export default ingredientsSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { INGREDIENTS_ENDPOINT } from '../utils/constants';
// import { checkResponse } from '../utils/api';
// import type { TIngredientData } from '../utils/types';

// interface IngredientsState {
// 	items: TIngredientData[];
// 	itemsMap: Record<string, TIngredientData>; // For fast lookup by ID (requirement #5)
// 	isLoading: boolean;
// 	hasError: boolean;
// 	error: string | null;
// }

// export const fetchIngredients = createAsyncThunk<TIngredientData[], void>(
// 	'ingredients/fetchIngredients',
// 	async (_, { rejectWithValue }) => {
// 		try {
// 			const response = await fetch(INGREDIENTS_ENDPOINT);
// 			const result = await checkResponse<{ data: TIngredientData[] }>(response);
// 			return result.data || [];
// 		} catch (error) {
// 			return rejectWithValue(
// 				error instanceof Error ? error.message : 'Unknown error'
// 			);
// 		}
// 	}
// );

// const initialState: IngredientsState = {
// 	items: [],
// 	itemsMap: {}, // Initialize empty map
// 	isLoading: false,
// 	hasError: false,
// 	error: null,
// };

// const ingredientsSlice = createSlice({
// 	name: 'ingredients',
// 	initialState,
// 	reducers: {},
// 	extraReducers: (builder) => {
// 		builder
// 			.addCase(fetchIngredients.pending, (state) => {
// 				state.isLoading = true;
// 				state.hasError = false;
// 				state.error = null;
// 			})
// 			.addCase(fetchIngredients.fulfilled, (state, action) => {
// 				state.isLoading = false;
// 				state.hasError = false;
// 				state.items = action.payload;

// 				// Create map for fast lookup (requirement #5)
// 				state.itemsMap = action.payload.reduce(
// 					(map, ingredient) => {
// 						map[ingredient._id] = ingredient;
// 						return map;
// 					},
// 					{} as Record<string, TIngredientData>
// 				);

// 				state.error = null;
// 			})
// 			.addCase(fetchIngredients.rejected, (state, action) => {
// 				state.isLoading = false;
// 				state.hasError = true;
// 				state.error = action.payload as string;
// 				state.items = [];
// 				state.itemsMap = {}; // Clear map on error
// 			});
// 	},
// });

// export default ingredientsSlice.reducer;
