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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { useNavigate } from "react-router-dom";

import { Tag, Select, Table } from "antd";
import { OrderContext } from "../../../provider/order";

const { Option } = Select;

function CreateTripDeliveryPage({ state, urlTrip }) {
  const toast = useToast({ position: "top" });
  const orderContext = useContext(OrderContext);
  const { setKeySelected } = orderContext;

  const navigate = useNavigate();
  const userContext = useContext(GlobalContext);
  const { headers, userInformation } = userContext;
  const [order, setOrder] = useState([]);
  const [order2, setOrder2] = useState([]);
  const [driver, setDriver] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [vehicle2, setVehicle2] = useState([]);

  const [payload1, setPayload1] = useState({
    // orderTripId: state?.orderTripInVehicle1st || state?.orderId,
    vehicleId: state?.vehicleId1St,
    driverId1st: 0,
    driverId2nd: 0,
    stockerId: userInformation?.accounId,
  });

  const [payload2, setPayload2] = useState({
    // orderTripId: state?.orderTripInVehicle2nd,
    vehicleId: state?.vehicleId2nd,
    driverId1st: 0,
    driverId2nd: 0,
    stockerId: userInformation?.accounId,
  });

  const handleOnChangeSelect = (name, value) => {
    setPayload1({ ...payload1, [name]: value });
  };
  const handleOnChangeSelect2 = (name, value) => {
    setPayload2({ ...payload2, [name]: value });
  };

  const handleFetchData = async () => {
    const dataOrderTrip = urlTrip.includes("create-trip/get")
      ? state?.orderTripInVehicle
      : state?.orderTripInVehicle1st;

    try {
      const promises = dataOrderTrip?.map(async (id) => {
        const response = await axios.get(
          `OrderTrip/itemOrderTrip?orderTripId=${id}`,
          { headers }
        );
        return response.data;
      });

      if (!promises) return;

      const results = await Promise.all(promises);

      const itemPromise = results.map(async ({ itemOrderTripResponse }) => {
        const response = await axios.get(
          `/Order/item?itemId=${itemOrderTripResponse[0]?.itemId}`,
          { headers }
        );
        return response.data.map((value) => ({
          ...value,
          orderTrip: itemOrderTripResponse[0]?.orderTrip,
        }));
      });

      const itemResult = await Promise.all(itemPromise);
      setOrder(itemResult.map((item) => item[0]));

      if (state?.orderTripInVehicle2nd?.length) {
        const promises2 = state?.orderTripInVehicle2nd.map(async (id) => {
          const response = await axios.get(
            `OrderTrip/itemOrderTrip?orderTripId=${id}`,
            { headers }
          );
          return response.data;
        });

        const results2 = await Promise.all(promises2);

        const itemPromise2 = results2.map(async ({ itemOrderTripResponse }) => {
          const response = await axios.get(
            `/Order/item?itemId=${itemOrderTripResponse[0]?.itemId}`,
            { headers }
          );
          return response.data.map((value) => ({
            ...value,
            orderTrip: itemOrderTripResponse[0]?.orderTrip,
          }));
        });

        const itemResult2 = await Promise.all(itemPromise2);

        setOrder2(itemResult2.map((item) => item[0]));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGetDriverAndVehicle = async () => {
    const vehicleId = urlTrip.includes("create-trip/get")
      ? state?.vehicleId
      : state?.vehicleId1St;
    try {
      const [getVehicle, getDriver] = await Promise.all([
        axios.get(`/Vehicle?vehicleId=${vehicleId}`, { headers }),
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
      if (state?.vehicleId2nd) {
        const getVehicle2 = await axios.get(
          `/Vehicle?vehicleId=${state?.vehicleId2nd}`,
          { headers }
        );
        if (getVehicle2.status === 200) {
          const vehicleData2 = getVehicle2.data;
          setVehicle2(vehicleData2);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hanldeCreteTrip = async () => {
    let url = urlTrip.includes("create-trip/delivery")
      ? "/Trips/api/CreateTripDelivery"
      : "/Trips/api/CreateTripGet";
    let navigateUrl = urlTrip.includes("create-trip/delivery")
      ? "/stocker/order-delivery"
      : "/stocker/order-get";
    try {
      if (state?.tripNumber === 2) {
        const createTrip = [payload1, payload2].map(async (item) => {
          const newPayload = {
            ...item,
            orderTripId: urlTrip.includes("create-trip/get")
              ? state?.orderTripInVehicle
              : state?.orderTripInVehicle1st,
            vehicleId: urlTrip.includes("create-trip/get")
              ? state?.vehicleId
              : item?.vehicleId,
          };
          const result = await axios.post(url, newPayload, { headers });
          return result;
        });
        const promiseAll = await Promise.all(createTrip);

        if (promiseAll.every((value) => value.status === 200)) {
          toast({
            title: "Cập nhật đơn hàng thành công!.",
            status: "success",
            isClosable: true,
          });
        }
      }
      if (state?.tripNumber === 1 || state?.orderId) {
        const newPayload = {
          ...payload1,
          orderTripId: urlTrip.includes("create-trip/get")
            ? state?.orderTripInVehicle
            : state?.orderTripInVehicle1st,
          vehicleId: urlTrip.includes("create-trip/get")
            ? state?.vehicleId
            : payload1?.vehicleId,
        };
        const result = await axios.post(url, newPayload, {
          headers,
        });
        if (result.status === 200) {
          toast({
            title: "Cập nhật đơn hàng thành công!.",
            status: "success",
            isClosable: true,
          });
          setKeySelected("2");
          navigate(navigateUrl);
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống!.",
        description: `${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (
      state?.orderTripInVehicle1st ||
      state?.orderId ||
      state?.orderTripInVehicle
    ) {
      handleFetchData();
    }
    handleGetDriverAndVehicle();
  }, [state?.orderTripInVehicle1st, state.orderId]);

  const columns = [
    {
      title: "",
      dataIndex: "key",
      rowScope: "row",
      align: "center",
      width: "35px",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "Dài(cm)",
      dataIndex: "length",
      key: "length",
      align: "center",
      render: (text) => <span>{text * 100}</span>,
    },
    {
      title: "Rộng(cm)",
      dataIndex: "width",
      key: "width",
      align: "center",
      render: (text) => <span>{text * 100}</span>,
    },
    {
      title: "Cao(cm)",
      dataIndex: "height",
      key: "height",
      align: "center",
      render: (text) => <span>{text * 100}</span>,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
    },
    {
      title: "Khối lượng(kg)",
      dataIndex: "unitWeight",
      key: "unitWeight",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantityItem",
      key: "quantityItem",
      align: "center",
      render: (text, record) => (
        <span>
          {state?.tripNumber === 2 ? record?.orderTrip?.quantityItem : text}
        </span>
      ),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   align: "center",
    //   render: (_, record) => (
    //     <button
    //       onClick={() => {
    //         console.log("record:", record);
    //         // handleRemoveItemSelected(index, item?.orderId)
    //       }}
    //     >
    //       <AiFillDelete />
    //     </button>
    //   ),
    // },
  ];

  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Flex w={"100%"} flexDirection={"column"} gap={10}>
          <Card>
            <CardHeader pb={0}>
              <Flex gap={2} alignItems="center">
                <Text fontSize="large" fontWeight={"600"}>
                  Mã đơn hàng:{" "}
                </Text>
                {state?.orderId?.map((value, index) => (
                  <Text key={value} fontSize="large" fontWeight={"600"}>
                    <Tag style={{ marginRight: "0" }}>{value}</Tag>
                    {index < state.orderId.length - 1 && ","}{" "}
                  </Text>
                ))}
              </Flex>

              <Text mt={2} fontWeight={"500"}>
                Gói hàng trên xe thứ nhất
              </Text>
            </CardHeader>
            <CardBody>
              <Stack>
                <HStack>
                  <Box w={"40%"}>
                    <FormControl isRequired>
                      <FormLabel>Tài xế 1:</FormLabel>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn tài xế"
                        onChange={(value) =>
                          handleOnChangeSelect("driverId1st", value)
                        }
                      >
                        {driver.map((item) => (
                          <Option
                            key={item?.driverId}
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
                            <div>
                              <Tag color="blue">{item?.account?.fullName}</Tag>,
                              Mã số TX:{" "}
                              <Tag color="orange">{item?.driverId}</Tag>, Trạng
                              thái: <Tag color="green">{item?.status}</Tag>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box w={"40%"}>
                    <FormControl isRequired>
                      <FormLabel>Tài xế 2:</FormLabel>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn tài xế"
                        onChange={(value) =>
                          handleOnChangeSelect("driverId2nd", value)
                        }
                      >
                        {driver.map((item) => (
                          <Option
                            key={item?.driverId}
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
                            <div>
                              <Tag color="blue">{item?.account?.fullName}</Tag>,
                              Mã số TX:{" "}
                              <Tag color="orange">{item?.driverId}</Tag>, Trạng
                              thái: <Tag color="green">{item?.status}</Tag>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box w={"60%"}>
                    <FormControl isRequired>
                      <FormLabel>Phương tiện:</FormLabel>
                      {/* {urlTrip.includes("create-trip/delivery") && (
                        <Input value={vehicle[0]?.vehicleId} />
                      )} */}
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn phương tiện"
                        onChange={(value) =>
                          handleOnChangeSelect("vehicleId", value)
                        }
                        value={vehicle[0]?.vehicleId}
                        // value={
                        //   urlTrip.includes("create-trip/delivery")
                        //     ? vehicle[0]?.vehicleId
                        //     : payload1?.vehicleId
                        // }
                      >
                        {/* <Option>Chọn phương tiện</Option> */}

                        {vehicle?.map((item, index) => (
                          <Option key={index} value={item?.vehicleId}>
                            Biển số:{" "}
                            <Tag color="#3d3d3d">{item?.licensePlate}</Tag>,
                            Trọng lượng:{" "}
                            <Tag color="geekblue">{item?.type} Tấn</Tag>, Số
                            khối(m3): <Tag color="cyan">{item?.capacity}</Tag>
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl isRequired>
                  <FormLabel>Các mặt hàng:</FormLabel>
                  <Table
                    dataSource={order[0]?.items ? order[0]?.items : order}
                    columns={columns}
                    rowKey="itemId"
                  />
                </FormControl>
              </Stack>
            </CardBody>
          </Card>
          {state?.tripNumber === 2 && (
            <Card>
              <CardHeader pb={0}>
                <Text fontWeight={"bold"}>Gói hàng trên xe thứ hai</Text>
              </CardHeader>
              <CardBody>
                <Stack>
                  <HStack>
                    <Box w={"40%"}>
                      <FormControl isRequired>
                        <FormLabel>Tài xế 1:</FormLabel>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Chọn tài xế"
                          onChange={(value) =>
                            handleOnChangeSelect2("driverId1st", value)
                          }
                        >
                          {driver.map((item) => (
                            <Option
                              key={item?.driverId}
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
                              <div>
                                <Tag color="blue">
                                  {item?.account?.fullName}
                                </Tag>
                                , Mã số TX:{" "}
                                <Tag color="orange">{item?.driverId}</Tag>,
                                Trạng thái:{" "}
                                <Tag color="green">{item?.status}</Tag>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box w={"40%"}>
                      <FormControl isRequired>
                        <FormLabel>Tài xế 2:</FormLabel>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Chọn tài xế"
                          onChange={(value) =>
                            handleOnChangeSelect2("driverId2nd", value)
                          }
                        >
                          {driver.map((item) => (
                            <Option
                              key={item?.driverId}
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
                              <div>
                                <Tag color="blue">
                                  {item?.account?.fullName}
                                </Tag>
                                , Mã số TX:{" "}
                                <Tag color="orange">{item?.driverId}</Tag>,
                                Trạng thái:{" "}
                                <Tag color="green">{item?.status}</Tag>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box w={"60%"}>
                      <FormControl isRequired>
                        <FormLabel>Phương tiện:</FormLabel>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Chọn phương tiện"
                          onChange={(value) =>
                            handleOnChangeSelect("vehicleId", value)
                          }
                          value={vehicle2[0]?.vehicleId}
                          // value={
                          //   urlTrip.includes("create-trip/delivery")
                          //     ? vehicle2[0]?.vehicleId
                          //     : payload2?.vehicleId
                          // }
                        >
                          {vehicle2?.map((item, index) => (
                            <Option key={index} value={item?.vehicleId}>
                              Biển số:{" "}
                              <Tag color="#3d3d3d">{item?.licensePlate}</Tag>,
                              Trọng lượng:{" "}
                              <Tag color="geekblue">{item?.type} Tấn</Tag>, Số
                              khối(m3):{" "}
                              <Tag color="cyan">{item?.capacity}</Tag>
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </HStack>
                  <FormControl isRequired>
                    <FormLabel>Các mặt hàng:</FormLabel>
                    <Table
                      rowKey="itemId"
                      dataSource={order2}
                      columns={columns}
                    />
                  </FormControl>
                </Stack>
              </CardBody>
            </Card>
          )}
        </Flex>
      </Flex>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button mt={10} colorScheme="blue" onClick={hanldeCreteTrip}>
          Tạo chuyến xe
        </Button>
      </div>
    </>
  );
}

export default CreateTripDeliveryPage;
