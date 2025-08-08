import { describe, it, expect, vi, beforeEach } from 'vitest';
import userReducer, {
	setUser,
	setAuthChecked,
	clearErrors,
	initialState,
} from './userSlice';
import {
	login,
	register,
	logout,
	getUser,
	updateUser,
	checkUserAuth,
} from './actions';

const mockUser = {
	email: 'test@example.com',
	name: 'Test User',
};

const mockUpdatedUser = {
	email: 'updated@example.com',
	name: 'Updated User',
};

vi.mock('../../utils/api', () => ({
	loginRequest: vi.fn(),
	registerRequest: vi.fn(),
	logoutRequest: vi.fn(),
	getUserRequest: vi.fn(),
	updateUserRequest: vi.fn(),
}));

describe('userSlice reducer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return the initial state', () => {
		const result = userReducer(undefined, { type: '@@INIT' });
		expect(result).toEqual(initialState);
	});

	describe('regular reducers', () => {
		it('should handle setUser', () => {
			const result = userReducer(initialState, setUser(mockUser));
			expect(result.user).toEqual(mockUser);
		});

		it('should handle setUser with null', () => {
			const stateWithUser = { ...initialState, user: mockUser };
			const result = userReducer(stateWithUser, setUser(null));
			expect(result.user).toBe(null);
		});

		it('should handle setAuthChecked', () => {
			const result = userReducer(initialState, setAuthChecked(true));
			expect(result.isAuthChecked).toBe(true);
		});

		it('should handle clearErrors', () => {
			const stateWithErrors = {
				...initialState,
				loginFailed: true,
				registerFailed: true,
				logoutFailed: true,
				getUserFailed: true,
				updateUserFailed: true,
			};
			const result = userReducer(stateWithErrors, clearErrors());
			expect(result.loginFailed).toBe(false);
			expect(result.registerFailed).toBe(false);
			expect(result.logoutFailed).toBe(false);
			expect(result.getUserFailed).toBe(false);
			expect(result.updateUserFailed).toBe(false);
		});
	});

	describe('login', () => {
		it('handles pending', () => {
			const result = userReducer(initialState, { type: login.pending.type });
			expect(result.loginRequest).toBe(true);
			expect(result.loginFailed).toBe(false);
		});

		it('handles fulfilled', () => {
			const result = userReducer(initialState, {
				type: login.fulfilled.type,
				payload: mockUser,
			});
			expect(result.loginRequest).toBe(false);
			expect(result.loginFailed).toBe(false);
			expect(result.user).toEqual(mockUser);
			expect(result.isAuthChecked).toBe(true);
		});

		it('handles rejected', () => {
			const result = userReducer(initialState, { type: login.rejected.type });
			expect(result.loginRequest).toBe(false);
			expect(result.loginFailed).toBe(true);
		});
	});

	describe('register', () => {
		it('handles pending', () => {
			const result = userReducer(initialState, { type: register.pending.type });
			expect(result.registerRequest).toBe(true);
			expect(result.registerFailed).toBe(false);
		});

		it('handles fulfilled', () => {
			const result = userReducer(initialState, {
				type: register.fulfilled.type,
				payload: mockUser,
			});
			expect(result.registerRequest).toBe(false);
			expect(result.registerFailed).toBe(false);
			expect(result.user).toEqual(mockUser);
			expect(result.isAuthChecked).toBe(true);
		});

		it('handles rejected', () => {
			const result = userReducer(initialState, {
				type: register.rejected.type,
			});
			expect(result.registerRequest).toBe(false);
			expect(result.registerFailed).toBe(true);
		});
	});

	describe('logout', () => {
		it('handles pending', () => {
			const result = userReducer(initialState, { type: logout.pending.type });
			expect(result.logoutRequest).toBe(true);
			expect(result.logoutFailed).toBe(false);
		});

		it('handles fulfilled', () => {
			const stateWithUser = { ...initialState, user: mockUser };
			const result = userReducer(stateWithUser, {
				type: logout.fulfilled.type,
			});
			expect(result.logoutRequest).toBe(false);
			expect(result.logoutFailed).toBe(false);
			expect(result.user).toBe(null);
		});

		it('handles rejected', () => {
			const result = userReducer(initialState, { type: logout.rejected.type });
			expect(result.logoutRequest).toBe(false);
			expect(result.logoutFailed).toBe(true);
		});
	});

	describe('getUser', () => {
		it('handles pending', () => {
			const result = userReducer(initialState, { type: getUser.pending.type });
			expect(result.getUserRequest).toBe(true);
			expect(result.getUserFailed).toBe(false);
		});

		it('handles fulfilled', () => {
			const result = userReducer(initialState, {
				type: getUser.fulfilled.type,
				payload: mockUser,
			});
			expect(result.getUserRequest).toBe(false);
			expect(result.getUserFailed).toBe(false);
			expect(result.user).toEqual(mockUser);
		});

		it('handles rejected', () => {
			const result = userReducer(initialState, { type: getUser.rejected.type });
			expect(result.getUserRequest).toBe(false);
			expect(result.getUserFailed).toBe(true);
		});
	});

	describe('updateUser', () => {
		it('handles pending', () => {
			const result = userReducer(initialState, {
				type: updateUser.pending.type,
			});
			expect(result.updateUserRequest).toBe(true);
			expect(result.updateUserFailed).toBe(false);
		});

		it('handles fulfilled', () => {
			const result = userReducer(initialState, {
				type: updateUser.fulfilled.type,
				payload: mockUpdatedUser,
			});
			expect(result.updateUserRequest).toBe(false);
			expect(result.updateUserFailed).toBe(false);
			expect(result.user).toEqual(mockUpdatedUser);
		});

		it('handles rejected', () => {
			const result = userReducer(initialState, {
				type: updateUser.rejected.type,
			});
			expect(result.updateUserRequest).toBe(false);
			expect(result.updateUserFailed).toBe(true);
		});
	});

	describe('checkUserAuth', () => {
		it('handles fulfilled', () => {
			const result = userReducer(initialState, {
				type: checkUserAuth.fulfilled.type,
				payload: mockUser,
			});
			expect(result.user).toEqual(mockUser);
			expect(result.isAuthChecked).toBe(true);
		});

		it('handles rejected', () => {
			const result = userReducer(
				{ ...initialState, user: mockUser },
				{ type: checkUserAuth.rejected.type }
			);
			expect(result.user).toBe(null);
			expect(result.isAuthChecked).toBe(true);
		});
	});
});
// import { describe, test, expect, vi, beforeEach } from 'vitest';
// import userReducer, {
// 	setUser,
// 	setAuthChecked,
// 	clearErrors,
// 	initialState,
// } from './userSlice';
// import {
// 	login,
// 	register,
// 	logout,
// 	getUser,
// 	updateUser,
// 	checkUserAuth,
// } from './actions';

// // Create mock user data directly in the test file
// const mockUser = {
// 	email: 'test@example.com',
// 	name: 'Test User',
// };

// const mockUpdatedUser = {
// 	email: 'updated@example.com',
// 	name: 'Updated User',
// };

// // Mock the API functions
// vi.mock('../../utils/api', () => ({
// 	loginRequest: vi.fn(),
// 	registerRequest: vi.fn(),
// 	logoutRequest: vi.fn(),
// 	getUserRequest: vi.fn(),
// 	updateUserRequest: vi.fn(),
// }));

// describe('userSlice reducer', () => {
// 	beforeEach(() => {
// 		vi.clearAllMocks();
// 	});

// 	test('should return the initial state', () => {
// 		const result = userReducer(undefined, { type: '@@INIT' });
// 		expect(result).toEqual(initialState);
// 	});

// 	describe('regular reducers', () => {
// 		test('should handle setUser', () => {
// 			const action = setUser(mockUser);
// 			const result = userReducer(initialState, action);

// 			// Test fields that should change
// 			expect(result.user).toEqual(mockUser);

// 			// Test fields that should NOT change
// 			expect(result.isAuthChecked).toBe(initialState.isAuthChecked);
// 			expect(result.loginRequest).toBe(initialState.loginRequest);
// 		});

// 		test('should handle setUser with null', () => {
// 			const stateWithUser = {
// 				...initialState,
// 				user: mockUser,
// 			};

// 			const action = setUser(null);
// 			const result = userReducer(stateWithUser, action);

// 			// Test fields that should change
// 			expect(result.user).toBe(null);

// 			// Test fields that should NOT change
// 			expect(result.isAuthChecked).toBe(stateWithUser.isAuthChecked);
// 		});

// 		test('should handle setAuthChecked', () => {
// 			const action = setAuthChecked(true);
// 			const result = userReducer(initialState, action);

// 			// Test fields that should change
// 			expect(result.isAuthChecked).toBe(true);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(initialState.user);
// 			expect(result.loginRequest).toBe(initialState.loginRequest);
// 		});

// 		test('should handle clearErrors', () => {
// 			const stateWithErrors = {
// 				...initialState,
// 				loginFailed: true,
// 				registerFailed: true,
// 				getUserFailed: true,
// 			};

// 			const action = clearErrors();
// 			const result = userReducer(stateWithErrors, action);

// 			// Test fields that should change
// 			expect(result.loginFailed).toBe(false);
// 			expect(result.registerFailed).toBe(false);
// 			expect(result.logoutFailed).toBe(false);
// 			expect(result.getUserFailed).toBe(false);
// 			expect(result.updateUserFailed).toBe(false);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(stateWithErrors.user);
// 			expect(result.isAuthChecked).toBe(stateWithErrors.isAuthChecked);
// 		});
// 	});

// 	describe('login async actions', () => {
// 		test('should handle login.pending', () => {
// 			const action = { type: login.pending.type };
// 			const result = userReducer(initialState, action);

// 			// Test fields that should change
// 			expect(result.loginRequest).toBe(true);
// 			expect(result.loginFailed).toBe(false);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(initialState.user);
// 			expect(result.isAuthChecked).toBe(initialState.isAuthChecked);
// 		});

// 		test('should handle login.fulfilled', () => {
// 			const loadingState = {
// 				...initialState,
// 				loginRequest: true,
// 			};

// 			const action = {
// 				type: login.fulfilled.type,
// 				payload: mockUser,
// 			};

// 			const result = userReducer(loadingState, action);

// 			// Test fields that should change
// 			expect(result.loginRequest).toBe(false);
// 			expect(result.loginFailed).toBe(false);
// 			expect(result.user).toEqual(mockUser);
// 			expect(result.isAuthChecked).toBe(true);
// 		});

// 		test('should handle login.rejected', () => {
// 			const loadingState = {
// 				...initialState,
// 				loginRequest: true,
// 			};

// 			const action = { type: login.rejected.type };
// 			const result = userReducer(loadingState, action);

// 			// Test fields that should change
// 			expect(result.loginRequest).toBe(false);
// 			expect(result.loginFailed).toBe(true);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(loadingState.user);
// 			expect(result.isAuthChecked).toBe(loadingState.isAuthChecked);
// 		});
// 	});

// 	describe('register async actions', () => {
// 		test('should handle register.pending', () => {
// 			const action = { type: register.pending.type };
// 			const result = userReducer(initialState, action);

// 			// Test fields that should change
// 			expect(result.registerRequest).toBe(true);
// 			expect(result.registerFailed).toBe(false);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(initialState.user);
// 		});

// 		test('should handle register.fulfilled', () => {
// 			const loadingState = {
// 				...initialState,
// 				registerRequest: true,
// 			};

// 			const action = {
// 				type: register.fulfilled.type,
// 				payload: mockUser,
// 			};

// 			const result = userReducer(loadingState, action);

// 			// Test fields that should change
// 			expect(result.registerRequest).toBe(false);
// 			expect(result.registerFailed).toBe(false);
// 			expect(result.user).toEqual(mockUser);
// 			expect(result.isAuthChecked).toBe(true);
// 		});

// 		test('should handle register.rejected', () => {
// 			const loadingState = {
// 				...initialState,
// 				registerRequest: true,
// 			};

// 			const action = { type: register.rejected.type };
// 			const result = userReducer(loadingState, action);

// 			// Test fields that should change
// 			expect(result.registerRequest).toBe(false);
// 			expect(result.registerFailed).toBe(true);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(loadingState.user);
// 		});
// 	});

// 	describe('logout async actions', () => {
// 		test('should handle logout.fulfilled', () => {
// 			const stateWithUser = {
// 				...initialState,
// 				user: mockUser,
// 				logoutRequest: true,
// 			};

// 			const action = { type: logout.fulfilled.type };
// 			const result = userReducer(stateWithUser, action);

// 			// Test fields that should change
// 			expect(result.logoutRequest).toBe(false);
// 			expect(result.logoutFailed).toBe(false);
// 			expect(result.user).toBe(null);

// 			// Test fields that should NOT change
// 			expect(result.isAuthChecked).toBe(stateWithUser.isAuthChecked);
// 		});
// 	});

// 	describe('getUser async actions', () => {
// 		test('should handle getUser.pending', () => {
// 			const action = { type: getUser.pending.type };
// 			const result = userReducer(initialState, action);

// 			// Test fields that should change
// 			expect(result.getUserRequest).toBe(true);
// 			expect(result.getUserFailed).toBe(false);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(initialState.user);
// 			expect(result.isAuthChecked).toBe(initialState.isAuthChecked);
// 		});

// 		test('should handle getUser.fulfilled', () => {
// 			const loadingState = {
// 				...initialState,
// 				getUserRequest: true,
// 			};

// 			const action = {
// 				type: getUser.fulfilled.type,
// 				payload: mockUser,
// 			};

// 			const result = userReducer(loadingState, action);

// 			// Test fields that should change
// 			expect(result.getUserRequest).toBe(false);
// 			expect(result.getUserFailed).toBe(false);
// 			expect(result.user).toEqual(mockUser);

// 			// Test fields that should NOT change
// 			expect(result.isAuthChecked).toBe(loadingState.isAuthChecked);
// 		});

// 		test('should handle getUser.rejected', () => {
// 			const loadingState = {
// 				...initialState,
// 				getUserRequest: true,
// 			};

// 			const action = { type: getUser.rejected.type };
// 			const result = userReducer(loadingState, action);

// 			// Test fields that should change
// 			expect(result.getUserRequest).toBe(false);
// 			expect(result.getUserFailed).toBe(true);

// 			// Test fields that should NOT change
// 			expect(result.user).toBe(loadingState.user);
// 			expect(result.isAuthChecked).toBe(loadingState.isAuthChecked);
// 		});
// 	});

// 	describe('updateUser async actions', () => {
// 		test('should handle updateUser.fulfilled', () => {
// 			const stateWithUser = {
// 				...initialState,
// 				user: mockUser,
// 				updateUserRequest: true,
// 			};

// 			const action = {
// 				type: updateUser.fulfilled.type,
// 				payload: mockUpdatedUser,
// 			};

// 			const result = userReducer(stateWithUser, action);

// 			// Test fields that should change
// 			expect(result.updateUserRequest).toBe(false);
// 			expect(result.updateUserFailed).toBe(false);
// 			expect(result.user).toEqual(mockUpdatedUser);

// 			// Test fields that should NOT change
// 			expect(result.isAuthChecked).toBe(stateWithUser.isAuthChecked);
// 		});
// 	});

// 	describe('checkUserAuth async actions', () => {
// 		test('should handle checkUserAuth.fulfilled', () => {
// 			const action = {
// 				type: checkUserAuth.fulfilled.type,
// 				payload: mockUser,
// 			};

// 			const result = userReducer(initialState, action);

// 			// Test fields that should change
// 			expect(result.user).toEqual(mockUser);
// 			expect(result.isAuthChecked).toBe(true);

// 			// Test fields that should NOT change
// 			expect(result.loginRequest).toBe(initialState.loginRequest);
// 		});

// 		test('should handle checkUserAuth.rejected', () => {
// 			const stateWithUser = {
// 				...initialState,
// 				user: mockUser,
// 			};

// 			const action = { type: checkUserAuth.rejected.type };
// 			const result = userReducer(stateWithUser, action);

// 			// Test fields that should change
// 			expect(result.user).toBe(null);
// 			expect(result.isAuthChecked).toBe(true);

// 			// Test fields that should NOT change
// 			expect(result.loginRequest).toBe(stateWithUser.loginRequest);
// 		});
// 	});
// });
