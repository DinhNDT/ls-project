import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";

function FormAdd() {
  return (
    <Stack spacing={4}>
      <FormControl id="stockName" isRequired>
        <FormLabel>Stock Name</FormLabel>
        <Input type="text" />
      </FormControl>
      <FormControl id="location" isRequired>
        <FormLabel>Location</FormLabel>
        <Input type="text" />
      </FormControl>
      <FormControl id="totalItem" isRequired>
        <FormLabel>Total Item</FormLabel>
        <Input type="number" />
      </FormControl>
    </Stack>
  );
}

export default FormAdd;
