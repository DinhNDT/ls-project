import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";

function FormUpdate({ distance, setDistance }) {
  const handleChangeInput = (name, value) => {
    setDistance((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Stack spacing={4}>
      <FormControl id="stockName" isRequired>
        <FormLabel>Tên kho</FormLabel>
        <Input
          type="text"
          value={distance?.stockName}
          onChange={(e) => handleChangeInput("stockName", e.target.value)}
        />
      </FormControl>
      <FormControl id="location" isRequired>
        <FormLabel>Vị trí</FormLabel>
        <Input
          type="text"
          value={distance?.location}
          onChange={(e) => handleChangeInput("location", e.target.value)}
        />
      </FormControl>
      <FormControl id="totalItem" isRequired>
        <FormLabel>Tổng sản phẩm</FormLabel>
        <Input
          type="number"
          value={distance?.totalItem}
          onChange={(e) => handleChangeInput("totalItem", e.target.value)}
        />
      </FormControl>
    </Stack>
  );
}

export default FormUpdate;
