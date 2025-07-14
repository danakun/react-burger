import { createAction } from '@reduxjs/toolkit';

export const wsConnect = createAction('ws/connect');
export const wsDisconnect = createAction('ws/disconnect');

export const wsMessage = createAction('ws/message');
export const wsError = createAction('ws/error');
