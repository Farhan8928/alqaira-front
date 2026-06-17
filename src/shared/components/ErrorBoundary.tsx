import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
          <h1 className="font-display text-3xl text-foreground">Something went wrong</h1>
          <p className="max-w-md text-sm text-muted-foreground">{this.state.message}</p>
          <button
            onClick={() => window.location.assign("/")}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
