import React from 'react';
import { logEvent } from "firebase/analytics";
import { analytics } from '../firebase';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log to Firebase Analytics
    if (analytics) {
        logEvent(analytics, 'exception', {
            description: error.toString(),
            fatal: true
        });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
            <p className="mb-4">We've been notified of the issue. Please try refreshing the page, or check back later.</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
            </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;