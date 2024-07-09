import React, { useContext } from "react";
import { GlobalContext } from "../provider";
import { Navigate } from "react-router-dom";

export const RoutePrivate = ({ children }) => {
  const loginContext = useContext(GlobalContext);
  const { userInformation } = loginContext;

  const isLogin = JSON.parse(sessionStorage.getItem("isLogin"));

  if (isLogin) {
    if (
      userInformation?.role === "Staff" ||
      userInformation?.role === "Company"
    ) {
      return (
        <Navigate
          to={`/${userInformation?.role.toLowerCase()}/manage-order`}
          replace={true}
        />
      );
    }

    if (userInformation?.role === "Stocker") {
      return <Navigate to={`/stocker/order-delivery`} replace={true} />;
    }

    if (userInformation?.role === "Admin") {
      return <Navigate to={`/admin`} replace={true} />;
    }
  }

  return <>{children}</>;
};
