import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import "aos/dist/aos.css";
import GuestLayout from "./layouts/guest";
import StaffLayout from "./layouts/staff";
import StockerLayout from "./layouts/stocker";
import CompanyLayout from "./layouts/company";
import "@goongmaps/goong-js/dist/goong-js.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<GuestLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/staff/*" element={<StaffLayout />} />
        <Route path="/stocker/*" element={<StockerLayout />} />
        <Route path="/company/*" element={<CompanyLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
