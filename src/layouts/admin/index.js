import SideBar from "../components/sidebar";
import OrderProvider from "../../provider/order";

function AdminLayout() {
  return (
    <OrderProvider>
      <SideBar />
    </OrderProvider>
  );
}

export default AdminLayout;
