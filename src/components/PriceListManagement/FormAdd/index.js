import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  InputGroup,
  InputRightAddon,
  HStack,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../provider";

function FormAdd({ prices, openModalAdd, setPrices }) {
  const [weight, setWeight] = useState([]);
  const [distanceMode, setDistanceMode] = useState([]);

  const userContext = useContext(GlobalContext);
  const { headers } = userContext;

  const handleFetchData = async () => {
    try {
      const [getListDistence, getWeight] = await Promise.all([
        axios.get("/DistanceMode", { headers }),
        axios.get("/WeightMode", { headers }),
      ]);
      if (getListDistence.status === 200) {
        const listPriceData = getListDistence.data;
        setDistanceMode(listPriceData);
      }
      if (getWeight.status === 200) {
        const listWeight = getWeight.data;
        setWeight(listWeight);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeInput = (name, value) => {
    setPrices((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (openModalAdd) handleFetchData();
  }, [headers, openModalAdd]);

  return (
    <Stack spacing={4}>
      <FormControl id="distanceModeId" isRequired>
        <FormLabel>Khoảng cách</FormLabel>
        <Select
          value={prices.distanceModeId}
          onChange={(e) => {
            handleChangeInput("distanceModeId", e.target.value);
          }}
        >
          {distanceMode?.map((item) => (
            <option value={item?.distanceModeId}>{item?.description}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="weightModeId" isRequired>
        <FormLabel>Trọng lượng</FormLabel>
        <Select
          value={prices.weightModeId}
          onChange={(e) => {
            handleChangeInput("weightModeId", e.target.value);
          }}
        >
          {weight?.map((item) => (
            <option value={item?.weightModeId}>{item?.maxWeight}</option>
          ))}
        </Select>
      </FormControl>
      <HStack>
        <FormControl id="price" isRequired>
          <FormLabel>Giá</FormLabel>
          <InputGroup>
            <Input
              type="number"
              value={prices.price}
              onChange={(e) => {
                handleChangeInput("price", e.target.value);
              }}
            />
            <InputRightAddon>VNĐ</InputRightAddon>
          </InputGroup>
        </FormControl>
        <FormControl id="insurance" isRequired>
          <FormLabel>Bảo hiểm</FormLabel>
          <InputGroup>
            <Input
              type="number"
              value={prices.insurance}
              onChange={(e) => {
                handleChangeInput("insurance", e.target.value);
              }}
            />
            <InputRightAddon>%</InputRightAddon>
          </InputGroup>
        </FormControl>
      </HStack>
    </Stack>
  );
}

export default FormAdd;
