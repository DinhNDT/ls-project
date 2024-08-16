import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { Select, Tag } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../provider";
const { Option } = Select;

export const FormVehicleAccident = ({
  tripIdSelected,
  setPayload,
  payload,
}) => {
  const [driver, setDriver] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState({
    vehicleId: "",
  });

  const userContext = useContext(GlobalContext);
  const { headers } = userContext;

  const handleOnChangeSelect = (name, value) => {
    setPayload({ ...payload, [name]: value });
  };

  const handleGetDriverAndVehicle = async () => {
    setIsLoading(true);
    try {
      const [getVehicle, getDriver] = await Promise.all([
        axios.get(`/Trips/trip/${tripIdSelected}/Vehicle`, { headers }),
        axios.get("/Drivers?status=Online", { headers }),
      ]);
      if (getVehicle.status === 200) {
        const vehicleData = getVehicle.data;
        setVehicle(vehicleData);
        handleOnChangeSelect("vehicleId", getVehicle.data.vehicleId);
      }
      if (getDriver.status === 200) {
        const driverData = getDriver.data;
        setDriver(driverData);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetDriverAndVehicle();
  }, []);

  return (
    <Flex pt={"15px"} pb={"20px"} flexDirection="column" gap="10px">
      <FormControl isRequired>
        <FormLabel>Tài xế 1:</FormLabel>
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn tài xế"
          onChange={(value) => handleOnChangeSelect("driverId1st", value)}
        >
          {driver.map((item) => (
            <Option
              key={item?.driverId}
              value={item?.driverId}
              disabled={
                parseInt(payload?.driverId2nd) === parseInt(item?.driverId)
              }
            >
              <div>
                <Tag color="blue">{item?.account?.fullName}</Tag>, Mã số TX:{" "}
                <Tag color="orange">{item?.driverId}</Tag>
              </div>
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Tài xế 2:</FormLabel>
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn tài xế"
          onChange={(value) => handleOnChangeSelect("driverId2nd", value)}
        >
          {driver.map((item) => (
            <Option
              key={item?.driverId}
              value={item?.driverId}
              disabled={
                parseInt(payload?.driverId1st) === parseInt(item?.driverId)
              }
            >
              <div>
                <Tag color="blue">{item?.account?.fullName}</Tag>, Mã số TX:{" "}
                <Tag color="orange">{item?.driverId}</Tag>
              </div>
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Phương tiện:</FormLabel>
        <Select
          loading={isLoading}
          style={{ width: "100%" }}
          placeholder="Chọn phương tiện"
          onChange={(value) => handleOnChangeSelect("vehicleId", value)}
          value={vehicle?.vehicleId}
        >
          {/* {vehicle?.map((item, index) => ( */}
          <Option value={vehicle?.vehicleId}>
            Biển số: <Tag color="#3d3d3d">{vehicle?.licensePlate}</Tag>, Trọng
            lượng: <Tag color="geekblue">{vehicle?.type} Tấn</Tag>, Số khối(m3):{" "}
            <Tag color="cyan">{vehicle?.capacity}</Tag>
          </Option>
          {/* ))} */}
        </Select>
      </FormControl>
    </Flex>
  );
};
