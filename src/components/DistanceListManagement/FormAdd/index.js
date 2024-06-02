import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  InputGroup,
  InputRightAddon,
  HStack,
  Textarea,
} from "@chakra-ui/react";

function FormAdd({ distance, setDistance }) {
  const handleChangeInput = (name, value) => {
    setDistance({ ...distance, [name]: value });
  };
  return (
    <Stack spacing={4}>
      <FormControl id="distanceId" isRequired>
        <FormLabel>Province Group</FormLabel>
        <Input
          type="text"
          value={distance.distanceId}
          onChange={(e) => {
            handleChangeInput("distanceId", e.target.value);
          }}
        />
      </FormControl>
      <HStack>
        <FormControl id="minDistance" isRequired>
          <FormLabel>Min Distance</FormLabel>
          <InputGroup>
            <Input
              type="number"
              value={distance.minDistance}
              onChange={(e) => {
                handleChangeInput("minDistance", e.target.value);
              }}
            />
            <InputRightAddon>km</InputRightAddon>
          </InputGroup>
        </FormControl>
        <FormControl id="maxDistance" isRequired>
          <FormLabel>Max Distance</FormLabel>
          <InputGroup>
            <Input
              type="number"
              value={distance.maxDistance}
              onChange={(e) => {
                handleChangeInput("maxDistance", e.target.value);
              }}
            />
            <InputRightAddon>km</InputRightAddon>
          </InputGroup>
        </FormControl>
      </HStack>
      <FormControl id="description" isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={distance.description}
          onChange={(e) => {
            handleChangeInput("description", e.target.value);
          }}
        />
      </FormControl>
    </Stack>
  );
}

export default FormAdd;
