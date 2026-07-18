import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import NotFound from './components/NotFound.jsx';
import './index.css';

// Simple native router to check the URL path
const currentPath = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The Error Boundary wraps everything to catch fatal crashes */}
    <ErrorBoundary>
      {/* If the URL is exactly '/', load the app. Otherwise, show 404. */}
      {currentPath === '/' ? <App /> : <NotFound />}
    </ErrorBoundary>
  </React.StrictMode>
);