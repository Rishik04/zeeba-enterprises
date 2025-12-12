
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </QueryClientProvider>
);
