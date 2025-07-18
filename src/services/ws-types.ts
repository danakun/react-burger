import { TOrderData } from '../utils/types';

// WebSocket message types for order feeds
export enum OrderFeedMessageType {
	ALL_ORDERS = 'all_orders',
	USER_ORDERS = 'user_orders',
}

// Base WebSocket message structure
export interface BaseWsMessage {
	success: boolean;
	message?: string;
}

// All orders feed message
export interface AllOrdersMessage extends BaseWsMessage {
	orders: TOrderData[];
	total: number;
	totalToday: number;
}

// User orders feed message
export interface UserOrdersMessage extends BaseWsMessage {
	orders: TOrderData[];
	total: number;
	totalToday: number;
}

// Union type for WebSocket messages
export type OrderFeedMessage = AllOrdersMessage | UserOrdersMessage;

// Error message type
export interface WsErrorMessage {
	message: string;
	success: false;
}

// WebSocket feed state type  for both feeds
export interface TFeedState {
	orders: TOrderData[];
	total: number;
	totalToday: number;
	isConnecting: boolean;
	isConnected: boolean;
	error: string | null;
}
