import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen bg-black text-red-500 p-8 flex flex-col items-center justify-center font-mono">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
                    <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full overflow-auto border border-red-900">
                        <h2 className="text-xl text-red-400 mb-2">Error:</h2>
                        <pre className="whitespace-pre-wrap break-words">{this.state.error?.toString()}</pre>

                        <h2 className="text-xl text-red-400 mt-4 mb-2">Component Stack:</h2>
                        <pre className="whitespace-pre-wrap text-sm text-gray-400">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="mt-8 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Clear Storage & Reload
                    </button>
                    <p className="mt-4 text-gray-500 text-sm">
                        If clearing storage doesn't work, please show this screen to the developer.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
