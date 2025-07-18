import { createAction } from '@reduxjs/toolkit';
import { UserOrdersMessage } from '../ws-types';
import { WS_BASE_URL } from '../../utils/constants';

// WebSocket connection actions
export const userFeedConnect = createAction<string>('userFeed/connect');
export const userFeedDisconnect = createAction('userFeed/disconnect');

export const userFeedConnecting = createAction('userFeed/connecting');
export const userFeedOpen = createAction('userFeed/open');
export const userFeedClose = createAction('userFeed/close');
export const userFeedError = createAction<string>('userFeed/error');
export const userFeedMessage =
	createAction<UserOrdersMessage>('userFeed/message');

// Actions object for middleware
export const userFeedWsActions = {
	connect: userFeedConnect,
	disconnect: userFeedDisconnect,
	onConnecting: userFeedConnecting,
	onOpen: userFeedOpen,
	onClose: userFeedClose,
	onError: userFeedError,
	onMessage: userFeedMessage,
};

// Helper function to construct WS URL with token
export const getUserOrdersWsUrl = (accessToken: string | null): string => {
	if (!accessToken) {
		throw new Error('Access token is required');
	}

	// token cleaning
	const cleanToken = accessToken.replace(/^Bearer\s+/i, '').trim();

	return `${WS_BASE_URL}?token=${cleanToken}`;
};
