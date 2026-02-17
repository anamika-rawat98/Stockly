import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { store } from "../src/store/store.ts";
import { Provider } from "react-redux";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={{}}>
      <Notifications
        position="top-right"
        zIndex={9999}
        containerWidth={320}
        styles={{
          root: {
            position: "fixed",
            top: "80px",
            right: "16px",
            zIndex: 9999,
          },
        }}
      />
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
