import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Pointing to uppercase App.tsx to resolve casing conflicts with root files and follow standard naming conventions
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