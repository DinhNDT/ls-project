import {
  FiHome,
  FiAward,
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiGlobe,
  FiFileText,
  FiShoppingCart,
} from "react-icons/fi";
import React, { useContext, useEffect, useState } from "react";
import {
  DesktopOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";

import { GlobalContext } from "../../../provider";
import { useNavigate } from "react-router-dom";
import OrderPage from "../../../pages/company/order/order";
import CreateOrderPage from "../../../pages/company/order/create-order";
import PriceListOrderPage from "../../../pages/price-list-order";
import { OrderContext } from "../../../provider/order";
import TripHistoryPage from "../../../pages/stocker/trip-history";
import StockerStockDetailPage from "../../../pages/stocker/stock/detail";
import StockPage from "../../../pages/stocker/stock/import-export";
import CreateTripDeliveryPage from "../../../pages/stocker/order/create-trip-delivery";
import { Avatar, Flex, HStack, VStack, Text } from "@chakra-ui/react";
import StatisticPage from "../../../pages/admin/statistic";
import StaffManagementPage from "../../../pages/admin/user-management";
import StockManagementPage from "../../../pages/admin/stock-management";
import PriceListManagementPage from "../../../pages/admin/price-list-management";
import DistanceManagementPage from "../../../pages/admin/distance-management";
import WeightManagementPage from "../../../pages/admin/weight-management";
import StockDetailPage from "../../../pages/admin/stock-detail";

const { Item } = Breadcrumb;
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const SideBar = () => {
  const orderContext = useContext(OrderContext);
  const { keySelected, setKeySelected, selectedItem, state, urlTrip } =
    orderContext;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const userContext = useContext(GlobalContext);
  const { setUserInformation, setIsLogin, userInformation } = userContext;
  const userRole = userInformation["role"];
  const [items, setItems] = useState([]);

  const handleChangeMenuItem = (e) => {
    setKeySelected(e.key);
  };

  const handleLogout = () => {
    setUserInformation({});
    setIsLogin(false);
    navigate("/");
  };
  useEffect(() => {
    if (keySelected === "4") {
      handleLogout();
    }
  }, [keySelected]);

  useEffect(() => {
    if (
      userInformation?.role === "Company" ||
      userInformation?.role === "Staff"
    ) {
      setItems([
        getItem("Đơn hàng", "sub1", <FiFileText />, [
          getItem("Quản lí đơn hàng", "1"),
          getItem("Tạo đơn hàng", "2"),
          getItem("Bảng giá dịch vụ", "3"),
        ]),
        getItem("Đăng xuất", "4", <LogoutOutlined />),
      ]);
    } else if (userInformation?.role === "Stocker") {
      setItems([
        getItem("Đơn hàng hôm nay", "sub2", <FiFileText />, [
          getItem("Cần Giao", "1"),
          getItem("Cần Lấy", "2"),
        ]),
        getItem("Chuyến xe", "sub3", <FiTruck />, [getItem("Lịch sử", "3")]),
        getItem("Kho", "sub4", <FiShoppingCart />, [
          getItem("Chi tiết", "5"),
          getItem("Nhập", "6"),
          getItem("Xuất", "7"),
        ]),
        getItem("Đăng xuất", "4", <LogoutOutlined />),
      ]);
    } else if (userInformation?.role === "Admin") {
      setItems([
        getItem("Thống kê", "1", <FiHome />),
        getItem("Người dùng", "2", <FiAward />),
        getItem("Kho", "3", <FiPackage />),
        getItem("Bảng giá", "5", <FiShoppingBag />),
        getItem("Khoảng cách", "6", <FiTruck />),
        getItem("Trọng lượng", "7", <FiGlobe />),
        getItem("Đăng xuất", "4", <LogoutOutlined />),
      ]);
    }
  }, [userInformation]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" style={{ padding: "30px" }}>
          <div className="logoDiv">
            <h1
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
              }}
            >
              <DesktopOutlined
                className="icon"
                style={{
                  color: "rgba(255, 255, 255, 0.65)",
                  marginRight: "10px",
                }}
              />
              LOGISTIC
            </h1>
          </div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleChangeMenuItem}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colorBgContainer,
          }}
        >
          <Flex flexDirection="row-reverse">
            <HStack>
              <Avatar size={"sm"} src={"https://i.imgur.com/9i2ANHO.jpeg"} />
              <VStack
                display={{ base: "none", md: "flex" }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
              >
                <Text fontSize="sm">{userInformation?.userName}</Text>
              </VStack>
              <BellOutlined style={{ fontSize: "17px" }} />
            </HStack>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Item>User</Item>
            <Item>Manage</Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* company, staff */}
            {keySelected === "0" &&
              (userRole === "Company" ||
                userRole === "Staff" ||
                userRole === "Stocker") && (
                <CreateOrderPage id={selectedItem?.orderId} />
              )}
            {keySelected === "1" &&
              (userRole === "Company" || userRole === "Staff") && <OrderPage />}
            {keySelected === "2" &&
              (userRole === "Company" || userRole === "Staff") && (
                <CreateOrderPage />
              )}
            {keySelected === "3" &&
              (userRole === "Company" || userRole === "Staff") && (
                <PriceListOrderPage />
              )}
            {/* stocker */}
            {keySelected === "1" && userRole === "Stocker" && (
              <OrderPage url="/stocker/order-delivery" />
            )}
            {keySelected === "2" && userRole === "Stocker" && (
              <OrderPage url="/stocker/order-get" />
            )}
            {keySelected === "3" && userRole === "Stocker" && (
              <TripHistoryPage />
            )}
            {keySelected === "5" && userRole === "Stocker" && (
              <StockerStockDetailPage />
            )}
            {keySelected === "6" && userRole === "Stocker" && (
              <StockPage url={"stock-import"} />
            )}
            {keySelected === "7" && userRole === "Stocker" && (
              <StockPage url={"stock-export"} />
            )}
            {keySelected === "8" && userRole === "Stocker" && (
              <CreateTripDeliveryPage state={state} urlTrip={urlTrip} />
            )}
            {/* admin  */}
            {keySelected === "1" && userRole === "Admin" && <StatisticPage />}
            {keySelected === "2" && userRole === "Admin" && (
              <StaffManagementPage />
            )}
            {keySelected === "3" && userRole === "Admin" && (
              <StockManagementPage />
            )}
            {keySelected === "5" && userRole === "Admin" && (
              <PriceListManagementPage />
            )}
            {keySelected === "6" && userRole === "Admin" && (
              <DistanceManagementPage />
            )}
            {keySelected === "7" && userRole === "Admin" && (
              <WeightManagementPage />
            )}
            {keySelected === "0" && userRole === "Admin" && (
              <StockDetailPage id={selectedItem?.stockId} />
            )}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default SideBar;
