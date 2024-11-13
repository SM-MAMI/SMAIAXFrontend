import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import Root from './Root.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <Root />
    </StrictMode>
);
