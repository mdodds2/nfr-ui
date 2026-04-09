import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import DisplayContextProvider from './store/display-context.jsx';
import { CartContextProvider } from './store/cart-context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CartContextProvider>
        <DisplayContextProvider>
          <App />
        </DisplayContextProvider>
      </CartContextProvider>
  </StrictMode>,
)
