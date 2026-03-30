import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { AppProvider } from "./AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <AppProvider>
      <NextUIProvider>
        {/* Dark Mode Wrapper - Minimal Dashboard Style */}
        <div className="dark text-foreground bg-[#121212] min-h-screen min-w-screen flex flex-col items-center pt-10 pb-20 px-4 md:px-8">
          <App />
        </div>
      </NextUIProvider>
    </AppProvider>
);
