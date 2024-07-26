import {
  FiHome,
  FiAward,
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiGlobe,
  FiFileText,
  FiShoppingCart,
  FiSettings,
} from "react-icons/fi";
import React, { useContext, useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import logo from "../../../assets/img/application.png";

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
import ReviewOrderPage from "../../../pages/company/order/review-order";
import { PaymentHistory } from "../../../pages/company/payment-history";
import { NotiBell } from "./NotiBell";
import UserPage from "../../../pages/user";

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
          getItem("Lịch sử thanh toán", "4A"),
        ]),
        getItem("Cài đặt", "sub2", <FiSettings />, [
          getItem("Người dùng", "5"),
        ]),
        getItem("Đăng xuất", "4", <LogoutOutlined />),
      ]);
    } else if (userInformation?.role === "Stocker") {
      setItems([
        getItem("Đơn hàng hôm nay", "sub2", <FiFileText />, [
          getItem("Đơn Hàng Cần Giao", "1"),
          getItem("Đơn Hàng Cần Lấy", "2"),
        ]),
        getItem("Chuyến xe", "sub3", <FiTruck />, [getItem("Lịch sử", "3")]),
        getItem("Kho", "sub4", <FiShoppingCart />, [
          getItem("Chi tiết", "5"),
          getItem("Nhập kho", "6"),
          getItem("Xuất kho", "7"),
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

  const renderSelectedKey = {
    0: "1",
    "0A": "1",
    "0AS": urlTrip,
    "2A": "2",
    8: urlTrip?.includes("get") ? "2" : "1",
  };
  const handleSelectedKey = (key) => {
    if (renderSelectedKey[key]) return renderSelectedKey[key];

    return key;
  };

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
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <img src={logo} alt="" width={40} height={40} />
            {!collapsed ? (
              <Text
                display={{ base: "none", md: "flex" }}
                fontSize="large"
                fontFamily="monospace"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
                color={"whitesmoke"}
              >
                Logistics
              </Text>
            ) : null}
          </div>
        </div>
        <Menu
          theme="dark"
          defaultOpenKeys={[userRole === "Stocker" ? "sub2" : "sub1"]}
          defaultSelectedKeys={["1"]}
          selectedKeys={[handleSelectedKey(keySelected)]}
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
              {/* <Avatar size={"sm"} src={userInformation?.image} /> */}
              <Avatar size={"sm"} src={"https://i.imgur.com/9i2ANHO.jpeg"} />
              <VStack
                display={{ base: "none", md: "flex" }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
              >
                <Text fontSize="sm">{userInformation?.userName}</Text>
              </VStack>
              <NotiBell />
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
            <Item>Người Dùng</Item>
            <Item>Quản Lý</Item>
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
            {keySelected === "0A" &&
              (userRole === "Company" || userRole === "Staff") && (
                <ReviewOrderPage id={selectedItem?.orderId} />
              )}
            {keySelected === "1" &&
              (userRole === "Company" || userRole === "Staff") && <OrderPage />}

            {keySelected === "2" && userRole === "Company" && (
              <CreateOrderPage />
            )}
            {keySelected === "2A" && userRole === "Company" && (
              <CreateOrderPage id={selectedItem?.orderId} />
            )}

            {keySelected === "2" && userRole === "Staff" && <CreateOrderPage />}

            {keySelected === "3" &&
              (userRole === "Company" || userRole === "Staff") && (
                <PriceListOrderPage />
              )}

            {keySelected === "4A" &&
              (userRole === "Company" || userRole === "Staff") && (
                <PaymentHistory
                  idByRole={userInformation?.idByRole}
                  userRole={userRole}
                />
              )}

            {keySelected === "5" &&
              (userRole === "Company" || userRole === "Staff") && <UserPage />}

            {/* stocker */}
            {keySelected === "0AS" && userRole === "Stocker" && (
              <ReviewOrderPage id={selectedItem?.orderId} />
            )}
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
