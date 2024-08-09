import SideBar from "../components/sidebar";
import OrderProvider from "../../provider/order";

function CompanyLayout() {
  return (
    <OrderProvider>
      <SideBar />
    </OrderProvider>
  );
}

export default CompanyLayout;
