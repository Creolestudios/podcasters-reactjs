import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import FallBack from './ErrorBoundary/FallBack';
import store from './redux/store';
import reportWebVitals from './reportWebVitals';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ErrorBoundary fallback={<FallBack />}>
      <BrowserRouter>
        <Toaster
          position='bottom-center'
          toastOptions={{
            style: {
              background: 'transparent',
              boxShadow: 'none',
            },
          }}
          reverseOrder
        />
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>,
  //  </React.StrictMode>
);
reportWebVitals();
