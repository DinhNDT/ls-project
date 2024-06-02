import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useState } from "react";

function FormUpdate({ distance, setDistance, readOnly }) {
  const handleChangeInput = (name, value) => {
    setDistance({ ...distance, [name]: value });
  };

  return (
    <Stack spacing={4}>
      <FormControl id="minWeight" isRequired>
        <FormLabel>Trọng lượng tối thiểu</FormLabel>
        <InputGroup>
          <Input
            isReadOnly={readOnly}
            type="number"
            value={distance.minWeight}
            onChange={(e) => {
              handleChangeInput("minWeight", e.target.value);
            }}
          />
          <InputRightAddon>kg</InputRightAddon>
        </InputGroup>
      </FormControl>
      <FormControl id="maxWeight" isRequired>
        <FormLabel>Trọng lượng tối đa</FormLabel>
        <InputGroup>
          <Input
            isReadOnly={readOnly}
            type="number"
            value={distance.maxWeight}
            onChange={(e) => {
              handleChangeInput("maxWeight", e.target.value);
            }}
          />
          <InputRightAddon>kg</InputRightAddon>
        </InputGroup>
      </FormControl>
    </Stack>
  );
}

export default FormUpdate;
