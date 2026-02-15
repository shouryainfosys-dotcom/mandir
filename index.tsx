import React from 'react';
import ReactDOM from 'react-dom/client';
// Fixed casing: Change import from './app' to './App' to match the file name 'App.tsx' and resolve casing mismatch errors.
import App from './App';

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