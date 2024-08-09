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
      <FormControl id="provinceGroup" isRequired>
        <FormLabel>Nhóm tỉnh</FormLabel>
        <Input
          type="text"
          value={distance.provinceGroup}
          onChange={(e) => {
            handleChangeInput("provinceGroup", e.target.value);
          }}
        />
      </FormControl>
      <HStack>
        <FormControl id="minDistance" isRequired>
          <FormLabel>Khoảng cách tối thiểu</FormLabel>
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
          <FormLabel>Khoảng cách tối đa</FormLabel>
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
        <FormLabel>Miêu tả</FormLabel>
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
