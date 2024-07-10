import { FormControl, FormLabel, Stack, Select } from "@chakra-ui/react";

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
          onChange={(e) => {
            handleChangeInput("locationInStock", e.target.value);
          }}
        >
          <option>Chọn khu</option>
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
