
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Fix: Use PascalCase 'App' to match the root file name and resolve casing conflicts in the build environment
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
