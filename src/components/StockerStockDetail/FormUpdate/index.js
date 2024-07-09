import { FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { Select } from "antd";
const { Option } = Select;

function FormUpdate({ locationInStock, setLocationInStock, readOnly }) {
  const stock = [
    { stockId: 1, stockName: "Khu A" },
    { stockId: 2, stockName: "Khu B" },
    { stockId: 3, stockName: "Khu C" },
    { stockId: 4, stockName: "Khu D" },
  ];

  const handleChangeInput = (name, value) => {
    setLocationInStock({ ...locationInStock, [name]: value });
  };

  return (
    <Stack spacing={4}>
      <FormControl id="locationInStock" isRequired>
        <FormLabel>Vị trí trong kho</FormLabel>
        <Select
          value={locationInStock?.locationInStock}
          onChange={(value) => {
            handleChangeInput("locationInStock", value);
          }}
        >
          <Option>Chọn kho</Option>
          {stock?.map((item, index) => (
            <Option key={index} value={item?.stockName}>
              {item?.stockName}
            </Option>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default FormUpdate;
