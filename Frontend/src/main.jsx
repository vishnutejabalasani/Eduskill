import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n';
import ErrorBoundary from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#00E676]">Loading...</div>}>
                <App />
            </Suspense>
        </ErrorBoundary>
    </React.StrictMode>,
)
