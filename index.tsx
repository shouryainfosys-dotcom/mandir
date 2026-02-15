import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Fixed: Corrected casing to match App.tsx and resolve compilation conflict
import App from './App.tsx';

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