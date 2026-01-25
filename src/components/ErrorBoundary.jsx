import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (<div className="p-4 m-2 bg-red-50 text-red-600 rounded border border-red-200 text-sm">
                    <p className="font-bold">Something went wrong in this section.</p>
                    <p className="font-mono text-xs mt-1">{this.state.error?.message}</p>
                </div>);
        }
        return this.props.children;
    }
}
