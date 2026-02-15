
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Fix: Use lowercase 'app' to match the canonical filename and avoid filesystem casing conflicts
import App from './app';

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
