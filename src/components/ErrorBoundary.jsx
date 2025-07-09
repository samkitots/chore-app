import React from 'react';
import { analytics } from '../firebase'; // Import the analytics instance from your firebase.js
import { logEvent } from 'firebase/analytics';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console for development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Log a custom event to Google Analytics
    logEvent(analytics, 'exception', {
      description: error.toString(),
      fatal: true, // Mark this as a fatal error
      component_stack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
