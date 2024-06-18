import { createContext, useState } from "react";

export const OrderContext = createContext();

function OrderProvider({ children }) {
  const [keySelected, setKeySelected] = useState("1");
  const [selectedItem, setSelectedItem] = useState();
  const [state, setState] = useState({});
  const [urlTrip, setUrlTrip] = useState("");

  return (
    <OrderContext.Provider
      value={{
        keySelected,
        setKeySelected,
        selectedItem,
        setSelectedItem,
        state,
        setState,
        urlTrip,
        setUrlTrip,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
