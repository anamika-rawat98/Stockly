import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { store } from "../src/store/store.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Provider store={store}>
          <div className="min-h-screen bg-white/20 backdrop-blur-lg">
            <App />
          </div>
        </Provider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
