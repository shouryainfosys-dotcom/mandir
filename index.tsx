import React from 'react';
import ReactDOM from 'react-dom/client';
// Use PascalCase for component imports to stay consistent with file naming conventions and resolve compiler warnings.
import App from './App';

// Root element check
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