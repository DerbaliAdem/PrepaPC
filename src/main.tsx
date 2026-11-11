import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { RevisionProvider } from './hooks/useRevisionProgress';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ThemeProvider>
        <RevisionProvider>
          <App />
        </RevisionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Offline support (production builds only, so the dev server is never cached).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {}));
}
