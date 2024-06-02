import Footer from "../components/footer";
import Header from "../components/header";
import SideBar from "../components/sidebar";
import bgAdmin from "../../assets/img/brand/admin-background.png";
import OrderProvider from "../../provider/order";

function CompanyLayout() {
  return (
    <OrderProvider>
      <SideBar />
    </OrderProvider>
  );
}

export default CompanyLayout;
