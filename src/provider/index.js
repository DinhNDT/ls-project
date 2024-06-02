// import axios from 'axios';
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext();

function GlobalProvider({ children }) {
  const [isLogin, setIsLogin] = useState(
    () => JSON.parse(sessionStorage.getItem("isLogin")) || false
  );

  const [userInformation, setUserInformation] = useState(
    () => JSON.parse(sessionStorage.getItem("userInformation")) || {}
  );

  const [headers, setHeaders] = useState({});

  useEffect(() => {
    sessionStorage.setItem("isLogin", JSON.stringify(isLogin));
  }, [isLogin]);

  useEffect(() => {
    sessionStorage.setItem("userInformation", JSON.stringify(userInformation));
    setHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInformation?.accessToken}`,
    });
  }, [userInformation]);

  return (
    <GlobalContext.Provider
      value={{
        isLogin,
        setIsLogin,
        userInformation,
        setUserInformation,
        headers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
