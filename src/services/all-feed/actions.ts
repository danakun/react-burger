// services/all-feed/actions.ts
import { createAction } from '@reduxjs/toolkit';
import { ALL_ORDERS_WS_URL } from '../../utils/constants';
import { AllOrdersMessage } from '../ws-types';

// WebSocket connection actions
export const allFeedConnect = createAction<string, 'allFeed/connect'>(
	'allFeed/connect'
);
export const allFeedDisconnect = createAction('allFeed/disconnect');

export const allFeedConnecting = createAction('allFeed/connecting');
export const allFeedOpen = createAction('allFeed/open');
export const allFeedClose = createAction('allFeed/close');
export const allFeedError = createAction<string>('allFeed/error');
export const allFeedMessage = createAction<AllOrdersMessage, 'allFeed/message'>(
	'allFeed/message'
);

// Actions object for middleware
export const allFeedWsActions = {
	connect: allFeedConnect,
	disconnect: allFeedDisconnect,
	onConnecting: allFeedConnecting,
	onOpen: allFeedOpen,
	onClose: allFeedClose,
	onError: allFeedError,
	onMessage: allFeedMessage,
};

export const getAllOrdersWsUrl = (): string => {
	return ALL_ORDERS_WS_URL;
};
