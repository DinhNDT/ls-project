import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
} from "@chakra-ui/react";

export const FormAddVehicle = ({ vehicle, setVehicle }) => {
  const handleChangeInput = (name, value) => {
    const newNumber = parseFloat(value, 10);
    const reg = /^[-+]?[0-9]*\.?[0-9]+$/;
    if (reg.test(value) || value === "") {
      setVehicle((prev) => ({ ...prev, [name]: newNumber }));
    }
  };

  return (
    <>
      <Stack spacing={4}>
        <FormControl id="licensePlate" isRequired>
          <FormLabel>Biển số xe</FormLabel>
          <Input
            type="text"
            placeholder="Nhập biển xố xe"
            value={vehicle?.licensePlate}
            onChange={(e) => {
              setVehicle((prev) => ({ ...prev, licensePlate: e.target.value }));
            }}
          />
        </FormControl>
        <FormControl id="type" isRequired>
          <FormLabel>Trọng lượng</FormLabel>
          <InputGroup>
            <Input
              type="number"
              placeholder="Nhập trọng lượng"
              value={vehicle?.type}
              onChange={(e) => {
                handleChangeInput("type", e.target.value);
              }}
            />
            <InputRightAddon>tấn</InputRightAddon>
          </InputGroup>
        </FormControl>
        <FormControl id="capacity" isRequired>
          <FormLabel>Số khối</FormLabel>
          <InputGroup>
            <Input
              type="number"
              placeholder="Nhập số khối"
              value={vehicle?.capacity}
              onChange={(e) => {
                handleChangeInput("capacity", e.target.value);
              }}
            />
            <InputRightAddon>mét khối (m3)</InputRightAddon>
          </InputGroup>
        </FormControl>
      </Stack>
    </>
  );
};
