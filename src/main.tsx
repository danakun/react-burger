import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// @ts-expect-error Ignored
import { store } from './services/store';
import { App } from '@/components/app/app';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
);
