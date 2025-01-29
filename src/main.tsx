import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './css/index.css';
import Root from './Root.tsx';

const updateSW: (reloadPage?: boolean) => void = registerSW({
    onNeedRefresh() {
        const userConfirmed: boolean = confirm('New version available. Refresh now?');
        if (userConfirmed) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log('PWA is ready to work offline!');
    },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <Root />
    </StrictMode>
);
