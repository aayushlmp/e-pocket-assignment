import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { loadAppConfig } from "@/services/config.service";
import { AuthProvider } from "@/contexts/AuthContext";
import "./index.css";

const bootstrapApplication = async () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AuthProvider>
        <Toaster
          position="top-right"
          visibleToasts={1}
          toastOptions={{
            classNames: {
              // Variants
              default:
                "bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-800",
              success:
                "bg-emerald-50! text-emerald-900! border-emerald-200! dark:bg-emerald-950! dark:text-emerald-200! dark:border-emerald-800!",
              error:
                "bg-rose-50! text-rose-900! border-rose-200! dark:bg-rose-950! dark:text-rose-200! dark:border-rose-800!",
              warning:
                "bg-amber-50! text-amber-900! border-amber-200! dark:bg-amber-950! dark:text-amber-200! dark:border-amber-800!",
              info: "bg-sky-50! text-sky-900! border-sky-200! dark:bg-sky-950! dark:text-sky-200! dark:border-sky-800!",
            },
          }}
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>,
  );
};
// Bootstrap application and load config
;(async () => {
  try {
    await loadAppConfig();
    bootstrapApplication()
    .catch((error) => console.error("Application bootstrap failed:", error));
  } catch (error) {
    throw new Error(`App config has not loaded: ${error}`);
  }
})()
