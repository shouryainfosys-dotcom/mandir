import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Fixed casing conflict: importing from App.tsx instead of app.tsx
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