import "@ant-design/v5-patch-for-react-19";
import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { router, queryClient } from "@/app/router";
import { setUnauthorizedHandler } from "@/shared/api/axiosInstance";
import "@/styles/reset.css";
import "@/styles/globals.css";

setUnauthorizedHandler(() => {
  queryClient.clear();
  void router.navigate({ to: "/login" });
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
