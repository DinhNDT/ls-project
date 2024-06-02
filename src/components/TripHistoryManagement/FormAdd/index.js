import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";

function FormAdd() {
  return (
    <Stack spacing={4}>
      <FormControl id="minWeight" isRequired>
        <FormLabel>Min Weight</FormLabel>
        <InputGroup>
          <Input type="number" />
          <InputRightAddon>kg</InputRightAddon>
        </InputGroup>
      </FormControl>
      <FormControl id="maxWeight" isRequired>
        <FormLabel>Max Weight</FormLabel>
        <InputGroup>
          <Input type="number" />
          <InputRightAddon>kg</InputRightAddon>
        </InputGroup>
      </FormControl>
    </Stack>
  );
}

export default FormAdd;
