import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Caught render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--color-bg,#14120f)] p-8 text-center text-[var(--color-text,#e9e4d8)]">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="max-w-md text-sm opacity-70">
            {this.state.error?.message || "An unexpected error occurred while rendering this page."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-2 rounded-lg border border-current px-4 py-1.5 text-sm"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}