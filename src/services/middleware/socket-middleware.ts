import {
	ActionCreatorWithoutPayload,
	ActionCreatorWithPayload,
	Middleware,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { refreshToken } from '../../utils/api';

export type TWsActions<R, S> = {
	connect: ActionCreatorWithPayload<string>;
	disconnect: ActionCreatorWithoutPayload;
	onConnecting?: ActionCreatorWithoutPayload;
	onOpen?: ActionCreatorWithoutPayload;
	onClose?: ActionCreatorWithoutPayload;
	onError: ActionCreatorWithPayload<string>;
	sendMessage?: ActionCreatorWithPayload<S>;
	onMessage: ActionCreatorWithPayload<R>;
};

const RECONNECT_PERIOD = 3000;

export const socketMiddleware = <R, S>(
	wsActions: TWsActions<R, S>,
	withTokenRefresh: boolean = false
): Middleware<object, RootState> => {
	return (store) => {
		let socket: WebSocket | null = null;
		const {
			connect,
			sendMessage,
			onOpen,
			onClose,
			onError,
			onMessage,
			onConnecting,
			disconnect,
		} = wsActions;
		const { dispatch } = store;
		let isConnected = false;
		let url = '';
		let reconnectId: NodeJS.Timeout | number | null = null;

		return (next) => (action) => {
			if (connect.match(action)) {
				socket = new WebSocket(action.payload);
				url = action.payload;
				isConnected = true;
				onConnecting && dispatch(onConnecting());

				socket.onopen = () => {
					onOpen && dispatch(onOpen());
				};

				socket.onerror = () => {
					dispatch(onError('WebSocket connection unknown error'));
				};

				socket.onclose = () => {
					onClose && dispatch(onClose());

					if (isConnected) {
						reconnectId = setTimeout(() => {
							dispatch(connect(url));
						}, RECONNECT_PERIOD);
					}
				};

				socket.onmessage = (event) => {
					const { data } = event;
					try {
						const parsedData = JSON.parse(data);

						// Handle token refresh
						if (
							withTokenRefresh &&
							parsedData.message === 'Invalid or missing token'
						) {
							refreshToken()
								.then((refreshedData) => {
									const wssUrl = new URL(url);
									wssUrl.searchParams.set(
										'token',
										refreshedData.accessToken.replace('Bearer ', '')
									);
									dispatch(connect(wssUrl.toString()));
								})
								.catch((error) => {
									dispatch(onError((error as Error).message));
								});

							dispatch(disconnect());
							return;
						}

						dispatch(onMessage(parsedData));
					} catch (error) {
						dispatch(onError((error as Error).message));
					}
				};

				return;
			}

			if (socket && sendMessage?.match(action)) {
				try {
					socket.send(JSON.stringify(action.payload));
				} catch (error) {
					dispatch(onError((error as Error).message));
				}

				return;
			}

			if (socket && disconnect.match(action)) {
				if (reconnectId) {
					clearTimeout(reconnectId);
					reconnectId = null;
				}
				isConnected = false;
				socket?.close();
				socket = null;

				return;
			}

			next(action);
		};
	};
};
