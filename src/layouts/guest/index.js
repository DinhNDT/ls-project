import AdminHeader from "../components/header";
import AdminFooter from "../components/footer";
import { Route, Routes, Navigate } from "react-router-dom";
import routes from "../../routes";
import { Box, useDisclosure } from "@chakra-ui/react";

function GuestLayout() {
  const { onOpen } = useDisclosure();
  const getRoutes = (routes = []) => {
    return routes.map((prop, key) => {
      if (prop.role === "guest") {
        return (
          <Route path={prop.path} element={prop.components} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };
  return (
    <Box>
      <AdminHeader onOpen={onOpen} notHaveSidebar={true} />
      <Box>
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <AdminFooter />
    </Box>
  );
}

export default GuestLayout;
