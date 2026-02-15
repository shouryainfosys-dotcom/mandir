import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// यहाँ 'App' को 'app' (छोटे 'a') से बदल दिया गया है ताकि 
// यह आपके प्रोजेक्ट की app.tsx फाइल से मैच कर सके।
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
