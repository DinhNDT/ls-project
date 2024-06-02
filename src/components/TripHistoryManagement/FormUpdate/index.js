import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useState } from "react";

function FormUpdate({ data, readOnly }) {
  const { weightModeId, minWeight, maxWeight } = data;

  const [weight, setWeight] = useState({
    minWeight,
    maxWeight,
  });

  return (
    <Stack spacing={4}>
      <FormControl id="minWeight" isRequired>
        <FormLabel>Min Weight</FormLabel>
        <InputGroup>
          <Input isReadOnly={readOnly} type="number" value={weight.minWeight} />
          <InputRightAddon>kg</InputRightAddon>
        </InputGroup>
      </FormControl>
      <FormControl id="maxWeight" isRequired>
        <FormLabel>Max Weight</FormLabel>
        <InputGroup>
          <Input isReadOnly={readOnly} type="number" value={weight.maxWeight} />
          <InputRightAddon>kg</InputRightAddon>
        </InputGroup>
      </FormControl>
    </Stack>
  );
}

export default FormUpdate;
