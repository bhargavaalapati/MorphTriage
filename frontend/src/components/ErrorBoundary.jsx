import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MorphTriage UI Fault:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <h1 className="text-red-500 text-6xl font-black mb-4 uppercase tracking-tighter">System Fault</h1>
          <p className="text-gray-400 mb-8 max-w-md">The MorphTriage architecture encountered an unexpected data collapse. Cache cleared.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-900/50"
          >
            Reboot Triage Layer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;