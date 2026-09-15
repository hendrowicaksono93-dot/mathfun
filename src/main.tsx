import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mencegah error "Database is closing/hidden" dari Firebase agar tidak ditandai sebagai kerusakan
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && typeof event.reason.message === 'string' && event.reason.message.includes('Database is closing/hidden')) {
    console.warn('Firebase IDB Warning (Handled):', event.reason.message);
    event.preventDefault(); // Mencegah crash log
  }
});

window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Database is closing/hidden')) {
    console.warn('Firebase IDB Warning (Handled):', event.message);
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
