import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Select,
  Stack,
  useDisclosure,
  IconButton,
  Text,
  Input,
  CardFooter,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { useNavigate } from "react-router-dom";

function CreateTripDeliveryPage({ state, urlTrip }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userContext = useContext(GlobalContext);
  const { headers, userInformation } = userContext;
  const [order, setOrder] = useState([]);
  const [order2, setOrder2] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [temporarySelectedIds, setTemporarySelectedIds] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [driver, setDriver] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [vehicle2, setVehicle2] = useState([]);

  const [payload1, setPayload1] = useState({
    orderTripId: state?.orderTripInVehicle1st || state?.orderId,
    vehicleId: state?.vehicleId1St,
    driverId1st: 0,
    driverId2nd: 0,
    stockerId: userInformation?.accounId,
  });

  const [payload2, setPayload2] = useState({
    orderTripId: state?.orderTripInVehicle2st,
    vehicleId: state?.vehicleId2St,
    driverId1st: 0,
    driverId2nd: 0,
    stockerId: userInformation?.accounId,
  });

  const onSelectChange = (_, selectedRows) => {
    setTemporarySelectedIds(selectedRows);
  };

  const handleAddOrder = () => {
    setSelectedIds(temporarySelectedIds);
    onClose();
  };

  const handleRemoveItemSelected = (indexToRemove, id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.filter((_, index) => index !== indexToRemove)
    );
    setTemporarySelectedIds((prevSelectedIds) =>
      prevSelectedIds.filter((item, _) => item?.orderId != id)
    );
  };

  const handleOnChangeSelect = (name, value) => {
    setPayload1({ ...payload1, [name]: value });
  };
  const handleOnChangeSelect2 = (name, value) => {
    setPayload2({ ...payload2, [name]: value });
  };

  const handleFetchData = async () => {
    try {
      const promises = state?.orderTripInVehicle1st.map(async (id) => {
        const response = await axios.get(
          `OrderTrip/itemOrderTrip?orderTripId=${id}`,
          { headers }
        );
        return response.data;
      });

      const results = await Promise.all(promises);

      const itemPromise = results.map(async (orderTrip) => {
        const response = await axios.get(
          `/Order/item?itemId=${orderTrip[0]?.itemId}`,
          { headers }
        );
        return response.data;
      });
      const itemResult = await Promise.all(itemPromise);
      setOrder(itemResult.map((item) => item[0]));

      if (state?.orderTripInVehicle2st?.length) {
        const promises2 = state?.orderTripInVehicle2st.map(async (id) => {
          const response = await axios.get(
            `OrderTrip/itemOrderTrip?orderTripId=${id}`
          );
          return response.data;
        });
        const results2 = await Promise.all(promises2);
        const itemPromise2 = results2.map(async (orderTrip) => {
          const response = await axios.get(
            `/Order/item?itemId=${orderTrip[0]?.itemId}`
          );
          return response.data;
        });
        const itemResult2 = await Promise.all(itemPromise2);
        setOrder2(itemResult2.map((item) => item[0]));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleFetchItemData = async () => {
    try {
      const getItem = await axios.get(`/Order/order?orderId=${state.orderId}`, {
        headers,
      });
      if (getItem.status === 200) {
        setOrder(getItem.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGetDriverAndVehicle = async () => {
    try {
      if (urlTrip.includes("stocker/create-trip/get")) {
        const [getVehicle, getDriver] = await Promise.all([
          axios.get(`/Vehicle/VehivleByVolume?orderId=${state?.orderId}`, {
            headers,
          }),
          axios.get("/Drivers?status=Online", { headers }),
        ]);
        if (getVehicle.status === 200) {
          const vehicleData = getVehicle.data;
          setVehicle(vehicleData);
        }
        if (getDriver.status === 200) {
          const driverData = getDriver.data;
          setDriver(driverData);
        }
        if (state?.vehicleId2St) {
          const getVehicle2 = await axios.get(
            `/Vehicle?vehicleId=${state?.vehicleId2St}`,
            { headers }
          );
          if (getVehicle2.status === 200) {
            const vehicleData2 = getVehicle2.data;
            setVehicle2(vehicleData2);
          }
        }
      } else {
        const [getVehicle, getDriver] = await Promise.all([
          axios.get(`/Vehicle?vehicleId=${state?.vehicleId1St}`, { headers }),
          axios.get("/Drivers?status=Online", { headers }),
        ]);
        if (getVehicle.status === 200) {
          const vehicleData = getVehicle.data;
          setVehicle(vehicleData);
        }
        if (getDriver.status === 200) {
          const driverData = getDriver.data;
          setDriver(driverData);
        }
        if (state?.vehicleId2St) {
          const getVehicle2 = await axios.get(
            `/Vehicle?vehicleId=${state?.vehicleId2St}`,
            { headers }
          );
          if (getVehicle2.status === 200) {
            const vehicleData2 = getVehicle2.data;
            setVehicle2(vehicleData2);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hanldeCreteTrip = async () => {
    let url = urlTrip.includes("create-trip/delivery")
      ? "/Trips/api/CreateTripDelivery"
      : `/Trips/api/CreateTripGet?orderId=${state?.orderId}`;
    let navigateUrl = urlTrip.includes("create-trip/delivery")
      ? "/stocker/order-delivery"
      : "/stocker/order-get";
    try {
      if (state?.tripNumber === 2) {
        const createTrip = [payload1, payload2].map(async (item) => {
          const result = await axios.post(url, item, { headers });
          return result;
        });
        const promiseAll = await Promise.all(createTrip);
      }
      if (state?.tripNumber === 1 || state?.orderId) {
        const result = await axios.post(url, payload1, {
          headers,
        });
        if (result.status === 200) {
          alert("Create trip successfully");
          navigate(navigateUrl);
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
    const newRowSelection = {
      onChange: onSelectChange,
      selectedRowKeys: temporarySelectedIds?.map((rowKey) => rowKey?.orderId),
      getCheckboxProps: (record) => ({
        name: record.name,
      }),
    };
    if (isOpen) {
      setRowSelection(newRowSelection);
    }
  }, [isOpen, temporarySelectedIds]);

  useEffect(() => {
    if (state?.orderTripInVehicle1st || state?.orderId) {
      handleFetchData();
    }
    handleGetDriverAndVehicle();
  }, [state?.orderTripInVehicle1st, state.orderId]);
  useEffect(() => {
    if (urlTrip.includes("create-trip/get")) {
      handleFetchItemData();
    }
  }, [urlTrip]);
  return (
    <>
      {/* <ModalOrder
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={order}
        rowSelection={rowSelection}
        handleAddOrder={handleAddOrder}
      /> */}
      {/* <CardComponent> */}

      <Flex justifyContent={"space-between"}>
        {/* //form */}
        <Flex w={"100%"}>
          <Card>
            <CardHeader pb={0}>
              <Text fontWeight={"bold"}>Gói hàng trên xe thứ nhất</Text>
            </CardHeader>
            <CardBody>
              <Stack>
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Tài xế 1:</FormLabel>
                    <Select
                      value={payload1?.driverId1st}
                      onChange={(e) =>
                        handleOnChangeSelect("driverId1st", e.target.value)
                      }
                    >
                      {driver.length ? (
                        <option>Chọn Tài Xế</option>
                      ) : (
                        <option>Không có tài xế rảnh</option>
                      )}
                      {driver.map((item) => (
                        <option
                          value={item?.driverId}
                          disabled={
                            parseInt(payload1?.driverId2nd) ===
                              parseInt(item?.driverId) ||
                            parseInt(payload2?.driverId1st) ===
                              parseInt(item?.driverId) ||
                            parseInt(payload2?.driverId2nd) ===
                              parseInt(item?.driverId)
                          }
                        >
                          {item?.account?.fullName +
                            " - " +
                            item?.account.citizenId}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Tài xế 2:</FormLabel>
                    <Select
                      value={payload1?.driverId2nd}
                      onChange={(e) =>
                        handleOnChangeSelect("driverId2nd", e.target.value)
                      }
                    >
                      {driver?.length ? (
                        <option>Chọn Tài Xế</option>
                      ) : (
                        <option>Không có tài xế rảnh</option>
                      )}
                      {driver.map((item) => (
                        <option
                          value={item?.driverId}
                          disabled={
                            parseInt(payload1?.driverId1st) ===
                              parseInt(item?.driverId) ||
                            parseInt(payload2?.driverId1st) ===
                              parseInt(item?.driverId) ||
                            parseInt(payload2?.driverId2nd) ===
                              parseInt(item?.driverId)
                          }
                        >
                          {item?.account?.fullName +
                            " - " +
                            item?.account.citizenId}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phương tiện:</FormLabel>
                    {urlTrip.includes("create-trip/delivery") && (
                      <Input value={vehicle[0]?.licensePlate} />
                    )}
                    {urlTrip.includes("create-trip/get") && (
                      <Select
                        onChange={(e) =>
                          handleOnChangeSelect("vehicleId", e.target.value)
                        }
                        value={payload1?.vehicleId}
                      >
                        <option>Chọn phương tiện</option>
                        {vehicle?.map((item, index) => (
                          <option key={index} value={item?.vehicleId}>
                            {item?.licensePlate}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </HStack>
                <FormControl isRequired>
                  <FormLabel>Các mặt hàng:</FormLabel>
                  <Flex flexWrap={"wrap"}>
                    {order[0]?.items
                      ? order[0]?.items.map((item, index) => {
                          return (
                            <Box mb={"10px"} mr={"10px"}>
                              <Button>
                                {item?.itemName +
                                  " - " +
                                  item?.color +
                                  " - " +
                                  item?.quantityItem}
                              </Button>
                              <IconButton
                                aria-label="Remove item"
                                icon={<CloseIcon />}
                                ml={"5px"}
                                onClick={() =>
                                  handleRemoveItemSelected(index, item?.orderId)
                                }
                              />
                            </Box>
                          );
                        })
                      : order?.map((item, index) => {
                          return (
                            <Box mb={"10px"} mr={"10px"}>
                              <Button>
                                {item?.itemName + " - " + item?.color}
                              </Button>
                              <IconButton
                                aria-label="Remove item"
                                icon={<CloseIcon />}
                                ml={"5px"}
                                onClick={() =>
                                  handleRemoveItemSelected(index, item?.orderId)
                                }
                              />
                            </Box>
                          );
                        })}
                  </Flex>
                  {/* <Button colorScheme="blue" onClick={onOpen}>
                    Thêm gói hàng
                  </Button> */}
                </FormControl>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button colorScheme="blue" onClick={hanldeCreteTrip}>
                Tạo chuyến xe
              </Button>
            </CardFooter>
          </Card>
          {state?.tripNumber === 2 && (
            <Card>
              <CardHeader pb={0}>
                <Text fontWeight={"bold"}>Gói hàng trên xe thứ hai</Text>
              </CardHeader>
              <CardBody>
                <Stack>
                  <HStack>
                    <FormControl isRequired>
                      <FormLabel>Tài xế 1:</FormLabel>
                      <Select
                        value={payload2?.driverId1st}
                        onChange={(e) =>
                          handleOnChangeSelect2("driverId1st", e.target.value)
                        }
                      >
                        {driver?.length ? (
                          <option>Chọn Tài Xế</option>
                        ) : (
                          <option>Không có tài xế rảnh</option>
                        )}
                        {driver.map((item) => (
                          <option
                            value={item?.driverId}
                            disabled={
                              parseInt(payload2?.driverId2nd) ===
                                parseInt(item?.driverId) ||
                              parseInt(payload1?.driverId1st) ===
                                parseInt(item?.driverId) ||
                              parseInt(payload1?.driverId2nd) ===
                                parseInt(item?.driverId)
                            }
                          >
                            {item?.account?.fullName +
                              " - " +
                              item?.account.citizenId}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Tài xế 2:</FormLabel>
                      <Select
                        value={payload2?.driverId2nd}
                        onChange={(e) =>
                          handleOnChangeSelect2("driverId2nd", e.target.value)
                        }
                      >
                        {driver?.length ? (
                          <option>Chọn Tài Xế</option>
                        ) : (
                          <option>Không có tài xế rảnh</option>
                        )}
                        {driver.map((item) => (
                          <option
                            value={item?.driverId}
                            disabled={
                              parseInt(payload2?.driverId1st) ===
                                parseInt(item?.driverId) ||
                              parseInt(payload1?.driverId1st) ===
                                parseInt(item?.driverId) ||
                              parseInt(payload1?.driverId2nd) ===
                                parseInt(item?.driverId)
                            }
                          >
                            {item?.account?.fullName +
                              " - " +
                              item?.account.citizenId}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Phương tiện:</FormLabel>
                      <Input value={vehicle2[0]?.licensePlate} />
                    </FormControl>
                  </HStack>
                  <FormControl isRequired>
                    <FormLabel>Các mặt hàng:</FormLabel>
                    <Flex flexWrap={"wrap"}>
                      {order2?.map((item, index) => {
                        return (
                          <Box mb={"10px"} mr={"10px"}>
                            <Button>
                              {item?.itemName +
                                " - " +
                                item?.color +
                                " - " +
                                item?.quantityItem}
                            </Button>
                            <IconButton
                              aria-label="Remove item"
                              icon={<CloseIcon />}
                              ml={"5px"}
                              onClick={() =>
                                handleRemoveItemSelected(index, item?.orderId)
                              }
                            />
                          </Box>
                        );
                      })}
                    </Flex>
                    {/* <Button colorScheme="blue" onClick={onOpen}>
                    Thêm gói hàng
                  </Button> */}
                  </FormControl>
                </Stack>
              </CardBody>
            </Card>
          )}
        </Flex>
        {/* map */}
        {/* <Box w={"70%"}> */}
        {/* <GoongMapWithRoute apiKey={GOONG_MAP_API_KEY} /> */}
        {/* </Box> */}
      </Flex>
      {/* </CardComponent> */}
    </>
  );
}

export default CreateTripDeliveryPage;
