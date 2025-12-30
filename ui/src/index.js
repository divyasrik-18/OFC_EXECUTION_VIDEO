import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 1. IMPORT THIS
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 2. CHANGE THIS LINE FROM unregister() TO register()
// serviceWorkerRegistration.register();

serviceWorkerRegistration.unregister();