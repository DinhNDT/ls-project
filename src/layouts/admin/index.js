// import Footer from "../components/footer";
// import Header from "../components/header";
import SideBar from "../components/sidebar";
// import bgAdmin from "../../assets/img/brand/admin-background.png";
import OrderProvider from "../../provider/order";

// import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
// import { Navigate, Route, Routes } from "react-router-dom";
// import routes from "../../routes";

function AdminLayout() {
  // const { isOpen, onOpen, onClose } = useDisclosure(); 
   
  // const getRoutes = (routes = []) => {
  //   return routes.map((prop, key) => {
  //     if (prop.role === "admin" || prop.role === "*") {
  //       return (
  //         <Route path={prop.path} element={prop.components} key={key} exact />
  //       );
  //     } else {
  //       return null;
  //     }
  //   });
  // };

  return (
    // <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
    //   <Box
    //     minH="40vh"
    //     w="100%"
    //     position="absolute"
    //     bgImage={bgAdmin}
    //     bg={bgAdmin}
    //     bgSize="cover"
    //     top="93px"
    //   />
      <OrderProvider>
        <SideBar  />
      </OrderProvider>
    //   <Header onOpen={onOpen} />
    //   <Box ml={{ base: 0, md: 60 }}>
    //     <Box p="1rem 3rem 100px">
    //       <Routes>
    //         {getRoutes(routes)}
    //         <Route
    //           path="*"
    //           element={<Navigate to="/admin/statistic" replace />}
    //         />
    //       </Routes>
    //     </Box>
    //     <Footer position="relative" zIndex="99" />
    //   </Box>
    // </Box>
  );
}

export default AdminLayout;
