import React from "react";
import ReactDOM from "react-dom/client";
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";

import {
    BrowserRouter
} from "react-router-dom";

import App from "./App";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";

const queryClient = new QueryClient({

    defaultOptions: {

        queries: {

            // Data is considered fresh for 30 seconds
            staleTime: 30 * 1000,

            // Keep unused cached data for 5 minutes
            gcTime: 5 * 60 * 1000,

            // Don't automatically refetch every time
            // the browser window gets focus
            refetchOnWindowFocus: false,

            retry: 1

        }

    }

});

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
<React.StrictMode>
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                    <App />

            </ThemeProvider>

        </QueryClientProvider>
    </BrowserRouter>
</React.StrictMode>

);