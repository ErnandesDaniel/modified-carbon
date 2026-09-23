import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { AppProviders } from "@/app/AppProviders";
import { queryClient } from "@/app/providers/providers/query-provider";
import LandingPage from "@/features/landing/pages/landing";
import LoginPage from "@/features/auth/pages/login";
import CabinetLayout from "@/features/cabinet/components/cabinet-layout";
import DashboardPage from "@/features/cabinet/pages/dashboard";
import CatalogPage from "@/features/cabinet/pages/catalog";
import OrdersPage from "@/features/cabinet/pages/orders";
import CertificatesPage from "@/features/cabinet/pages/certificates";
import { checkAuth } from "@/shared/lib";

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: AppProviders,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async ({ context }) => {
    await checkAuth(context.queryClient);
  },
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: async ({ context }) => {
    await checkAuth(context.queryClient, { redirectToIfAuth: "/cabinet" });
  },
  component: LoginPage,
});

const cabinetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cabinet",
  beforeLoad: async ({ context }) => {
    await checkAuth(context.queryClient, { redirectToIfNotAuth: "/login" });
  },
  component: CabinetLayout,
});

const cabinetIndexRoute = createRoute({
  getParentRoute: () => cabinetRoute,
  path: "/",
  component: DashboardPage,
});

const catalogRoute = createRoute({
  getParentRoute: () => cabinetRoute,
  path: "/catalog",
  component: CatalogPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => cabinetRoute,
  path: "/orders",
  component: OrdersPage,
});

const certificatesRoute = createRoute({
  getParentRoute: () => cabinetRoute,
  path: "/certificates",
  component: CertificatesPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  cabinetRoute.addChildren([cabinetIndexRoute, catalogRoute, ordersRoute, certificatesRoute]),
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
