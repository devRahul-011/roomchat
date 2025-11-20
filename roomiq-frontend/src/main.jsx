import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./config/Routes";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")).render(
  <div>
    <Toaster position="top-center" />
    <AppProvider>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </AppProvider>
  </div>
);
