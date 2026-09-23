import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import PortalShell from "@/app/PortalShell";
import { AppProviders } from "@/app/providers/AppProviders";
import AuditPage from "@/features/audit/pages/audit";
import LoginPage from "@/features/auth/pages/login";
import CertificatesPage from "@/features/certificates/pages/certificates";
import DashboardPage from "@/features/dashboard/pages/dashboard";
import NeedlecastDetailPage from "@/features/needlecast/pages/detail";
import NeedlecastListPage from "@/features/needlecast/pages/list";
import OrdersPage from "@/features/orders/pages/orders";
import SettingsPage from "@/features/settings/pages/settings";
import SleevesPage from "@/features/sleeves/pages/sleeves";
import UsersPage from "@/features/users/pages/users";
import ValidationDetailPage from "@/features/validation/pages/detail";
import ValidationListPage from "@/features/validation/pages/list";
import { checkAuth } from "@/shared/lib/utils/auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: AppProviders,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: ({ context }) => checkAuth(context.queryClient, { redirectToIfAuth: "/dashboard" }),
  component: LoginPage,
});

const portalRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "portal",
  beforeLoad: ({ context }) => checkAuth(context.queryClient, { redirectToIfNotAuth: "/login" }),
  component: PortalShell,
});

const indexRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const sleevesRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/sleeves",
  component: SleevesPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/orders",
  component: OrdersPage,
});

const needlecastRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/needlecast",
  component: NeedlecastListPage,
});

const needlecastDetailRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/needlecast/$id",
  component: () => {
    const { id } = needlecastDetailRoute.useParams();
    return <NeedlecastDetailPage id={id} />;
  },
});

const validationRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/validation",
  component: ValidationListPage,
});

const validationDetailRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/validation/$id",
  component: () => {
    const { id } = validationDetailRoute.useParams();
    return <ValidationDetailPage id={id} />;
  },
});

const certificatesRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/certificates",
  component: CertificatesPage,
});

const usersRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/users",
  component: UsersPage,
});

const auditRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/audit",
  component: AuditPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  portalRoute.addChildren([
    indexRoute,
    dashboardRoute,
    sleevesRoute,
    ordersRoute,
    needlecastRoute,
    needlecastDetailRoute,
    validationRoute,
    validationDetailRoute,
    certificatesRoute,
    usersRoute,
    auditRoute,
    settingsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
});
