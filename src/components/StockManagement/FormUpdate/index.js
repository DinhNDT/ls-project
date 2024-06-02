import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

function FormUpdate({ data }) {
  const { stockId, location, stockName, totalItem } = data;

  const [stock, setStock] = useState({
    stockId,
    location,
    stockName,
    totalItem,
  });

  return (
    <Stack spacing={4}>
      <FormControl id="stockName" isRequired>
        <FormLabel>Stock Name</FormLabel>
        <Input type="text" value={stock.stockName} />
      </FormControl>
      <FormControl id="location" isRequired>
        <FormLabel>Location</FormLabel>
        <Input type="text" value={stock.location} />
      </FormControl>
      <FormControl id="totalItem" isRequired>
        <FormLabel>Total Item</FormLabel>
        <Input type="number" value={stock.totalItem} />
      </FormControl>
    </Stack>
  );
}

export default FormUpdate;
