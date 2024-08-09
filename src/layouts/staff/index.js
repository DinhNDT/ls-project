import SideBar from "../components/sidebar";
import OrderProvider from "../../provider/order";

function StaffLayout() {
  return (
    <OrderProvider>
      <SideBar />
    </OrderProvider>
  );
}

export default StaffLayout;
