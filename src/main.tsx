import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './app/App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('[RWP] Root element #root not found in DOM.');

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
