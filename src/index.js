import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import GlobalProvider from "./provider";
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById("root"));
axios.defaults.baseURL = "https://nhatlocphatexpress.azurewebsites.net/api";

root.render(
  <GlobalProvider>
    <ChakraProvider>
      <React.StrictMode>
        <App />
        <div id="Popup-PayOs"></div>
      </React.StrictMode>
    </ChakraProvider>
  </GlobalProvider>
);
