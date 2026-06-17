import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { queryClient } from "./app/queryClient";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster richColors closeButton position="top-center" />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
