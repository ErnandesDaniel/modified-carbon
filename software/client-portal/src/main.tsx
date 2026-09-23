import "@ant-design/v5-patch-for-react-19";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/app/router";
import type { ApiError } from "@/shared/api";
import "@/app/styles/reset.css";
import "@/app/styles/globals.css";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
