import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Fix: Change import to use PascalCase 'App' and remove extension to resolve naming conflict errors
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