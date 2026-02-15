import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import from app.tsx (lowercase) to maintain consistency and avoid casing collision errors
import App from './app.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);