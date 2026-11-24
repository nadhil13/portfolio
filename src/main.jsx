// src/main.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Preloader from './components/Preloader.jsx';
import './index.css';
import './lib/scrollMotion';
import './styles/form-enhancements.css';


// Error Boundary Component yang lebih robust
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }


  static getDerivedStateFromError(error) {
    return { hasError: true };
  }


  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    
    // Khusus untuk Three.js geometry errors
    if (error.message && error.message.includes('geometry')) {
      console.log('Three.js geometry error detected, attempting recovery...');
      // Coba reload setelah delay singkat
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }


  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060010] flex items-center justify-center text-white p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-cyan-400">Oops! Something went wrong.</h1>
            <p className="text-gray-400 mb-6">Terjadi kesalahan saat memuat aplikasi. Silakan coba refresh halaman.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors font-semibold"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details (Dev Only)</summary>
                <pre className="text-xs text-red-400 mt-2 bg-black/50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }


    return this.props.children;

}
}

/**
 * Komponen wrapper utama ...
 */
const Main = () => {
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // Loading Timeout
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (!preloaderFinished) {
        console.warn('Loading timeout - forcing app to show');
        setPreloaderFinished(true);
      }
    }, 15000);

    return () => clearTimeout(loadingTimeout);
  }, [preloaderFinished]);

  // Preloader finish
  const handlePreloaderFinished = () => {
    console.log('Preloader finished, showing main app');
    setPreloaderFinished(true);
  };

  // Global error handling
  const handleError = (error) => {
    console.error('Global error caught:', error);
    setGlobalError(error);
  };

  // Error handler untuk uncaught errors
  const handleUnhandledError = (event) => {
    console.error('Unhandled error:', event.error);
    setGlobalError(event.error);
  };

  const handleUnhandledRejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    setGlobalError(new Error(event.reason?.toString() || 'Unknown error'));
  };

  // Setup global error listeners
  useEffect(() => {
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (globalError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Oops! Something went wrong</h1>
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>{globalError.message || 'An unexpected error occurred'}</p>
        <button
          onClick={() => {
            setGlobalError(null);
            window.location.reload();
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  };

  if (!preloaderFinished) {
    return (
      <ErrorBoundary>
        <Preloader onComplete={handlePreloaderFinished} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <App onError={handleError} />
    </ErrorBoundary>
  );
};

// Wrapper komponen untuk memastikan Preloader dan App di-mount dalam mode strict
const AppWrapper = () => {
  return (
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  );
};

// Render aplikasi
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);
