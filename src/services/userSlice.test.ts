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
