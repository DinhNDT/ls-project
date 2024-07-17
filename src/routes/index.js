import StatisticPage from "../pages/admin/statistic";
import StaffManagementPage from "../pages/admin/user-management";
import IndexPage from "../pages";
import ProfilePage from "../pages/profile";
import StockManagementPage from "../pages/admin/stock-management";
import PriceListManagementPage from "../pages/admin/price-list-management";
import LoginPage from "../pages/authentication/login";
import RegisterPage from "../pages/authentication/register";
import IdentifyPage from "../pages/authentication/identify";
// import StockerDashboardPage from "../pages/stocker/dashboard";
import DistanceManagementPage from "../pages/admin/distance-management";
import WeightManagementPage from "../pages/admin/weight-management";
import StockDetailPage from "../pages/admin/stock-detail";
import OrderPage from "../pages/staff/order/order";
import CreateOrderPage from "../pages/staff/order/create-order";
import { default as CompanyOrderPage } from "../pages/company/order/order";
import { default as CompanyCreateOrderPage } from "../pages/company/order/create-order";

import { default as StockerOrderPage } from "../pages/stocker/order/order";
import TripHistoryPage from "../pages/stocker/trip-history";
import CreateTripDeliveryPage from "../pages/stocker/order/create-trip-delivery";
import PriceListOrderPage from "../pages/price-list-order";
import StockPage from "../pages/stocker/stock/import-export";
import StockerStockDetailPage from "../pages/stocker/stock/detail";
import { RoutePrivate } from "./route-private";
import TrackingOrder from "../pages/tracking-order";

const routes = [
  {
    path: "/",
    components: (
      <RoutePrivate>
        <IndexPage />
      </RoutePrivate>
    ),
    role: "guest",
  },
  {
    path: "/sign-in",
    components: (
      <RoutePrivate>
        <LoginPage />
      </RoutePrivate>
    ),
    role: "guest",
  },
  {
    path: "/sign-up",
    components: (
      <RoutePrivate>
        <RegisterPage />
      </RoutePrivate>
    ),
    role: "guest",
  },
  {
    path: "/tracking-order/:id",
    components: (
      <RoutePrivate>
        <TrackingOrder />
      </RoutePrivate>
    ),
    role: "guest",
  },
  {
    path: "/identify",
    components: <IdentifyPage />,
    role: "guest",
  },
  {
    path: "/profile",
    components: <ProfilePage />,
    role: "*",
  },
  {
    path: "/profile/:id",
    components: <ProfilePage />,
    role: "*",
  },
  {
    path: "/price-list-order",
    components: <PriceListOrderPage />,
    role: "*",
  },

  ///admin
  {
    path: "/statistic",
    components: <StatisticPage />,
    role: "admin",
  },
  {
    path: "/user-management",
    components: <StaffManagementPage />,
    role: "admin",
  },
  {
    path: "/stock-management",
    components: <StockManagementPage />,
    role: "admin",
  },
  {
    path: "/stock-detail/:id",
    components: <StockDetailPage />,
    role: "admin",
  },
  {
    path: "/price-list-management",
    components: <PriceListManagementPage />,
    role: "admin",
  },
  {
    path: "/distance-management",
    components: <DistanceManagementPage />,
    role: "admin",
  },
  {
    path: "/weight-management",
    components: <WeightManagementPage />,
    role: "admin",
  },
  //staff
  {
    path: "/manage-order",
    components: <OrderPage />,
    role: "staff",
  },
  {
    path: "/create-order",
    components: <CreateOrderPage />,
    role: "staff",
  },

  {
    path: "/order-detail/:id",
    components: <CreateOrderPage />,
    role: "staff",
  },
  //stocker
  {
    path: "/order-delivery",
    components: <StockerOrderPage />,
    role: "stocker",
  },
  {
    path: "/order-get",
    components: <StockerOrderPage />,
    role: "stocker",
  },
  {
    path: "/order-detail/:id",
    components: <CreateOrderPage />,
    role: "stocker",
  },
  {
    path: "/create-trip/*",
    components: <CreateTripDeliveryPage />,
    role: "stocker",
  },
  {
    path: "/stock-import",
    components: <StockPage />,
    role: "stocker",
  },
  {
    path: "/stock-export",
    components: <StockPage />,
    role: "stocker",
  },
  {
    path: "/stock-detail",
    components: <StockerStockDetailPage />,
    role: "stocker",
  },
  {
    path: "/trip-history",
    components: <TripHistoryPage />,
    role: "stocker",
  },

  // company
  {
    path: "/manage-order",
    components: <CompanyOrderPage />,
    role: "company",
  },
  {
    path: "/create-order",
    components: <CompanyCreateOrderPage />,
    role: "company",
  },

  {
    path: "/order-detail/:id",
    components: <CompanyCreateOrderPage />,
    role: "company",
  },
];

export default routes;
