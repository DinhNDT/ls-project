import { FormControl, FormLabel, Stack, Select } from "@chakra-ui/react";
import { useState } from "react";

function FormUpdate({ locationInStock, setLocationInStock, readOnly }) {
  const [stock, setStock] = useState([
    { stockId: 1, stockName: "Kho A" },
    { stockId: 2, stockName: "Kho B" },
    { stockId: 3, stockName: "Kho C" },
    { stockId: 4, stockName: "Kho D" },
  ]);
  const handleChangeInput = (name, value) => {
    setLocationInStock({ ...locationInStock, [name]: value });
  };

  return (
    <Stack spacing={4}>
      <FormControl id="locationInStock" isRequired>
        <FormLabel>Vị trí trong kho</FormLabel>
        <Select
          value={locationInStock?.locationInStock}
          onChange={(e) => {
            handleChangeInput("locationInStock", e.target.value);
          }}
        >
          <option>Chọn kho</option>
          {stock?.map((item, index) => (
            <option key={index} value={item?.stockName}>
              {item?.stockName}
            </option>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default FormUpdate;
