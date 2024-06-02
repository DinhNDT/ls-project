import * as XLSX from "xlsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  useToast,
  NumberInputField,
  Flex,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch,
} from "@chakra-ui/react";
import { Card, Form, Input, Select, Button as ButtonAntd } from "antd";
import { FiBox, FiRefreshCw, FiXCircle, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../provider";
import {
  convertOrder,
  formatDate,
  formatMoney,
  getDateNowIso,
} from "../../../helpers";
import axios from "axios";
import { TbFileImport } from "react-icons/tb";
import TextArea from "antd/es/input/TextArea";
import { OrderContext } from "../../../provider/order";

const defaultItem = {
  itemName: "",
  insurance: false,
  description: "",
  unitPrice: 0,
  quantityItem: 0,
  unitWeight: 0,
  length: 0,
  width: 0,
  height: 0,
  color: "",
};

const CreateOrderForm = ({ id }) => {
  const navigate = useNavigate();
  const userContext = useContext(GlobalContext);
  const { userInformation, headers } = userContext;
  const orderContext = useContext(OrderContext);
  const { setKeySelected } = orderContext;

  const [order, setOrder] = useState({
    orderDate: getDateNowIso(),
    companyId: "",
    dayGet: "",
    locationDetailGet: "",
    provinceGet: "",
    cityGet: "",
    districtGet: "",
    wardGet: "",
    locationDetailDelivery: "",
    provinceDelivery: "",
    cityDelivery: "",
    districtDelivery: "",
    wardDelivery: "",
    deliveryTo: "",
    deliveryPhone: "",
    pack: 0,
    supperMarket: 0,
    accountId: null,
    items: [],
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setItemSelected] = useState(defaultItem);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  const [provincesList2, setProvincesList2] = useState([]);
  const [districtsList2, setDistrictsList2] = useState([]);

  const [wardsList, setWardsList] = useState([]);
  const [wardsList2, setWardsList2] = useState([]);

  const [company, setCompany] = useState([]);

  const [orderBill, setOrderBill] = useState({});

  const [itemData, setItemData] = useState(defaultItem || {});

  const fileInputRef = useRef(null);

  const [companyData, setCompanyData] = useState({});

  const handleItemChange = (name, value) => {
    setItemData({ ...itemData, [name]: value });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  function checkCompletion(obj) {
    for (const key in obj) {
      if (
        key === "pack" ||
        key === "supperMarket" ||
        key === "totalInsurance" ||
        key === "distance" ||
        key === "totalWeight" ||
        key === "deliveryPrice"
      ) {
        if (obj[key] === undefined || obj[key] === null) {
          return false;
        }
      } else if (key === "accountId") {
      } else if (key === "items") {
        if (!Array.isArray(obj[key])) {
          return false;
        }
      } else {
        if (!obj[key]) {
          return false;
        }
      }
    }
    return true;
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const convertedData = parsedData.slice(1).map((row) => ({
        itemName: row[0],
        insurance: row[1],
        description: row[2],
        unitPrice: row[3],
        quantityItem: row[4],
        unitWeight: row[5],
        length: row[6],
        width: row[7],
        height: row[8],
        color: row[9],
      }));
      setOrder({ ...order, items: [...order?.items, ...convertedData] });
    };
    reader.readAsBinaryString(file);
  };

  const handleFetchData = async () => {
    if (userInformation?.role === "Company") {
      try {
        const getCompany = await axios.get(
          `/Company?accountId=${userInformation?.accounId}`,
          {
            headers,
          }
        );
        if (getCompany.status === 200) {
          let companyData = getCompany.data;
          setOrder({ ...order, companyId: companyData[0]?.companyId });
          setCompanyData(companyData[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    try {
      const getCompany = await axios.get(`/Company`, {
        headers,
      });
      if (getCompany.status === 200) {
        const companyData = getCompany.data;
        setCompany(companyData);
      }
    } catch (err) {
      console.error(err);
    }
    if (id) {
      try {
        const getOrder = await axios.get(`/Order/order?orderId=${id}`, {
          headers,
        });

        if (getOrder.status === 200) {
          let companyData = getOrder.data;
          if (companyData.length) {
            let data = companyData[0];
            setOrder(data);
            setOrderBill({
              totalInsurance: data?.totalInsurance,
              distance: data?.distance,
              expectedDeliveryDate: data?.expectedDeliveryDate,
              deliveryPrice: data?.deliveryPrice,
              totalWeight: data?.totalWeight,
              longtitudeDelivery: data?.longtitudeDelivery,
              latitudeDelivery: data?.latitudeDelivery,
            });
            if (
              userInformation?.role === "Staff" ||
              userInformation?.role === "Stocker"
            ) {
              const getCompany = await axios.get(
                `/Company?accountId=${data?.accountId}`,
                {
                  headers,
                }
              );
              if (getCompany.status === 200) {
                let companyData = getCompany.data;
                setCompanyData(companyData[0]);
              }
            }
          }
        } else {
          console.log("Can't get time share");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (name, value) => {
    setItemSelected((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleChangeOrder = (name, value) => {
    setOrder((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };
  const handleGetCompanyInformation = async (id) => {
    try {
      const getCompany = await axios.get(`/Company?companyId=${id}`, {
        headers,
      });
      if (getCompany.status === 200) {
        let companyData = getCompany.data;
        setCompanyData(companyData[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const toast = useToast();

  const handleUpdateItem = () => {
    const updatedItems = [...order.items];
    updatedItems[selectedIndex] = selectedItem; // Update the item at the selected index
    setOrder({
      ...order,
      items: updatedItems,
    });
    setItemSelected(defaultItem);
    onClose();
  };

  const handleProvinceChange = (provinceName) => {
    const provinceIndex = provincesList.find(
      (province) => province.province_name == provinceName
    );
    const provinceId = provinceIndex?.province_id;
    apiGetPublicDistrict(provinceId);
  };

  const handleProvinceChange2 = (provinceName) => {
    const provinceIndex = provincesList2.find(
      (province) => province.province_name == provinceName
    );
    const provinceId = provinceIndex?.province_id;
    apiGetPublicDistrict2(provinceId);
  };

  const handleDistrictChange = (districtName) => {
    const districtIndex = districtsList.find(
      (district) => district.district_name == districtName
    );
    const districtId = districtIndex?.district_id;
    apiGetPublicWard(districtId);
  };

  const handleDistrictChange2 = (districtName) => {
    const districtIndex = districtsList2.find(
      (district) => district.district_name == districtName
    );
    const districtId = districtIndex?.district_id;
    apiGetPublicWard2(districtId);
  };

  const apiGetPublicProvinces = async () => {
    try {
      const response = await axios.get(
        "https://vapi.vnappmob.com/api/province/"
      );
      setProvincesList(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicProvinces2 = async () => {
    try {
      const response = await axios.get(
        "https://vapi.vnappmob.com/api/province/"
      );
      setProvincesList2(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicDistrict = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/district/${provinceId}`
      );
      setDistrictsList(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicDistrict2 = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/district/${provinceId}`
      );
      setDistrictsList2(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard = async (districtId) => {
    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/ward/${districtId}`
      );
      setWardsList(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard2 = async (districtId) => {
    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/ward/${districtId}`
      );
      setWardsList2(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleCreateResponse = async () => {
    if (!id) {
      try {
        const OrderCreateResponse = await axios.put(
          "/Order/OrderCreateResponse",
          convertOrder(order),
          { headers }
        );
        if (OrderCreateResponse.status === 200) {
          const responseData = OrderCreateResponse.data;
          setOrderBill(responseData);
        } else {
          console.log("Cant create response");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleUpdateOrder = async (status) => {
    try {
      const updateOrder = await axios.put(
        `/Order/api/UpdateOrder?orderId=${order?.orderId}&status=${status}`,
        { headers }
      );
      if (updateOrder.status === 200) {
        toast({
          title: "Update Order success.",
          description: "We've received your order.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("order/manage-order");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        ...order,
        ...orderBill,
        accountId: userInformation?.accounId,
      };
      let userRole = userInformation?.role;
      let url =
        userRole === "Staff"
          ? "/staff/manage-order"
          : userRole === "Company"
          ? "/company/manage-order"
          : "";
      if (id) {
        const UpdateOrder = await axios.put("/Order/update-order", payload, {
          headers,
        });
        if (UpdateOrder.status === 200) {
          // toast({
          //   title: "Update Order success.",
          //   description: "We've received your order.",
          //   status: "success",
          //   duration: 3000,
          //   isClosable: true,
          // });
          // navigate(url);
          alert("Gửi thông tin đơn hàng thành công");
          setKeySelected("1");
        } else {
          console.log("Can't update order");
        }
      } else {
        const AddCompany = await axios.post("/Order", payload, { headers });
        if (AddCompany.status === 200) {
          // toast({
          //   title: "Order submitted.",
          //   description: "We've received your order.",
          //   status: "success",
          //   duration: 3000,
          //   isClosable: true,
          // });
          alert("Đã gửi thông tin đơn hàng");
          setKeySelected("1");
          // navigate(url);
        } else {
          alert("Không thể tạo đơn");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ModalItem = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật mặt hàng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tên mặt hàng</FormLabel>
              <Input
                value={selectedItem?.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Bảo hiểm</FormLabel>
              <Switch
                isChecked={selectedItem?.insurance}
                onChange={(e) => handleChange("insurance", e.target.checked)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Giá trị đơn hàng</FormLabel>
              <Input
                value={selectedItem?.unitPrice}
                precision={2}
                min={0}
                onChange={(valueString) =>
                  handleChange("unitPrice", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Số lượng</FormLabel>
              <Input
                value={selectedItem?.quantityItem}
                min={0}
                onChange={(valueString) =>
                  handleChange("quantityItem", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Khối lượng (kg)</FormLabel>
              <Input
                value={selectedItem?.unitWeight}
                precision={2}
                min={0}
                onChange={(valueString) =>
                  handleChange("unitWeight", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Dài (m)</FormLabel>
              <Input
                value={selectedItem?.length}
                precision={2}
                min={0}
                onChange={(valueString) =>
                  handleChange("length", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Rộng (m)</FormLabel>
              <Input
                value={selectedItem?.width}
                precision={2}
                min={0}
                onChange={(valueString) =>
                  handleChange("width", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cao (m)</FormLabel>
              <Input
                value={selectedItem?.height}
                precision={2}
                min={0}
                onChange={(valueString) =>
                  handleChange("height", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Màu sắc</FormLabel>
              <Input
                value={selectedItem?.color}
                onChange={(e) => handleChange("color", e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mô tả</FormLabel>
              <TextArea
                value={selectedItem?.description}
                cols={6}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" onClick={handleUpdateItem}>
            Sửa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  useEffect(() => {
    if (headers) {
      handleFetchData();
    }
    apiGetPublicProvinces();
    apiGetPublicProvinces2();
  }, [headers]);

  useEffect(() => {
    if (!id && order) {
      if (checkCompletion(order)) {
        handleCreateResponse();
      }
    }
  }, [id, order]);

  useEffect(() => {
    if (id) {
      const provinceId = provincesList.find(
        (item) => item.province_name === order?.provinceGet
      );
      if (provinceId?.province_id)
        apiGetPublicDistrict(provinceId?.province_id);
    }
  }, [provincesList, order, id]);

  useEffect(() => {
    if (id) {
      const provinceId = provincesList2.find(
        (item) => item.province_name === order?.provinceDelivery
      );
      if (provinceId?.province_id)
        apiGetPublicDistrict2(provinceId?.province_id);
    }
  }, [provincesList2, order, id]);

  useEffect(() => {
    if (id) {
      const districtId = districtsList.find(
        (item) => item.district_name === order?.districtGet
      );
      if (districtId?.district_id) apiGetPublicWard(districtId?.district_id);
    }
  }, [districtsList, order, id]);

  useEffect(() => {
    if (id) {
      const districtId = districtsList2.find(
        (item) => item.district_name === order?.districtDelivery
      );
      if (districtId?.district_id) apiGetPublicWard2(districtId?.district_id);
    }
  }, [districtsList2, order, id]);

  return (
    <>
      {!id && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Button
            position="fixed"
            bottom={orderBill?.expectedDeliveryDate ? "120px" : "50px"}
            right={"50px"}
            bgColor={"#0BC5EA"}
            zIndex={"100"}
            borderRadius={"50%"}
            w={"50px"}
            h={"50px"}
            onClick={handleButtonClick}
          >
            <TbFileImport style={{ fontSize: "24px" }} />
          </Button>
        </>
      )}
      <Box padding={"0 3%"} maxW={"1200px"} margin={"0 auto"}>
        {ModalItem}
        <Stack maxW={"1200px"}>
          <Card type="inner" title="Thông tin Công Ty">
            <Form layout="vertical">
              <Flex justifyContent={"space-between"}>
                <Form.Item
                  required
                  label="Tên công ty"
                  style={{
                    width: "19%",
                    marginBottom: "10px",
                    padding: "0 0 3px",
                  }}
                >
                  {userInformation?.role === "Staff" && !id ? (
                    <Select
                      onChange={(event) => {
                        handleChangeOrder("companyId", event);
                        handleGetCompanyInformation(event);
                      }}
                      value={order.companyId}
                    >
                      <option value="">Chọn công ty</option>
                      {company.map((company) => (
                        <option
                          key={company.companyId}
                          value={company.companyId}
                        >
                          {company.companyName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      placeholder="input placeholder"
                      value={companyData?.companyName}
                    />
                  )}
                </Form.Item>{" "}
                <Form.Item
                  required
                  label="Mã số thuế"
                  style={{ width: "19%", marginBottom: "10px" }}
                >
                  <Input
                    placeholder="input placeholder"
                    value={companyData?.account?.citizenId}
                  />
                </Form.Item>{" "}
                <Form.Item
                  required
                  label="Số điện thoại"
                  style={{ width: "19%", marginBottom: "10px" }}
                >
                  <Input
                    placeholder="input placeholder"
                    value={companyData?.account?.phone}
                  />
                </Form.Item>{" "}
                <Form.Item
                  required
                  label="Email"
                  style={{ width: "19%", marginBottom: "10px" }}
                >
                  <Input
                    placeholder="input placeholder"
                    value={companyData?.account?.email}
                  />
                </Form.Item>{" "}
                <Form.Item
                  required
                  label="Người đại diện"
                  style={{ width: "19%", marginBottom: "10px" }}
                >
                  <Input
                    placeholder="input placeholder"
                    value={companyData?.account?.userName}
                  />
                </Form.Item>
              </Flex>
              <Form.Item required label="Địa chỉ">
                <TextArea
                  placeholder="input placeholder"
                  rows={1}
                  value={companyData?.companyLocation}
                />
              </Form.Item>
            </Form>
          </Card>
          <Box height={"2%"}></Box>
          <Flex justifyContent={"space-between"} mb={"1%"}>
            <Card
              title="Thông tin lấy hàng"
              type="inner"
              style={{ width: "48%" }}
            >
              <Stack spacing={4}>
                <Form layout="vertical">
                  <HStack>
                    <Form.Item required label="Số điện thoại người gửi">
                      <Input
                        onChange={(event) =>
                          handleChangeOrder("getPhone", event.target.value)
                        }
                        value={companyData?.account?.phone}
                        disabled={id ? true : false}
                      />
                    </Form.Item>
                    <Form.Item required label="Họ tên người gửi">
                      <Input
                        onChange={(event) =>
                          handleChangeOrder("getTo", event.target.value)
                        }
                        disabled={id ? true : false}
                        value={companyData?.account?.userName}
                      />
                    </Form.Item>
                  </HStack>
                  <Form.Item required label="Địa chỉ gửi hàng">
                    <Input
                      onChange={(event) =>
                        handleChangeOrder(
                          "locationDetailGet",
                          event.target.value
                        )
                      }
                      w={"94%"}
                      value={order?.locationDetailGet}
                      isReadOn
                      disabled={id ? true : false}
                    />
                  </Form.Item>

                  <HStack mb={"2%"}>
                    <Select
                      onChange={(event) => {
                        handleChangeOrder("provinceGet", event);
                        handleChangeOrder("cityGet", event);
                        handleProvinceChange(event);
                      }}
                      value={order?.provinceGet}
                    >
                      {id ? (
                        provincesList
                          .filter(
                            (province) =>
                              province.province_name === order?.provinceGet
                          )
                          .map((province) => (
                            <option
                              key={province.province_id}
                              value={province.province_id}
                            >
                              {province.province_name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provincesList.map((province) => (
                            <option
                              key={province.province_id}
                              value={province.province_name}
                            >
                              {province.province_name}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                    <Select
                      onChange={(event) => {
                        handleChangeOrder("districtGet", event);
                        handleDistrictChange(event);
                      }}
                      value={order?.districtGet}
                    >
                      {id ? (
                        districtsList
                          .filter(
                            (district) =>
                              district.district_name === order?.districtGet
                          )
                          .map((district) => (
                            <option
                              key={district.district_id}
                              value={district.district_id}
                            >
                              {district.district_name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="">Chọn quận/huyện</option>
                          {districtsList.map((district) => (
                            <option
                              key={district.id}
                              value={district.district_name}
                            >
                              {district.district_name}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                    <Select
                      onChange={(event) => handleChangeOrder("wardGet", event)}
                      value={order?.wardGet}
                    >
                      {id ? (
                        wardsList
                          .filter((ward) => ward.ward_name === order?.wardGet)
                          .map((ward) => (
                            <option key={ward.ward_id} value={ward.ward_id}>
                              {ward.ward_name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="">Chọn xã/phường</option>
                          {wardsList.map((ward) => (
                            <option key={ward.id} value={ward.ward_name}>
                              {ward.ward_name}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                  </HStack>

                  <Form.Item required label="Ngày lấy hàng">
                    <Input
                      type="datetime-local"
                      onChange={(event) =>
                        handleChangeOrder("dayGet", event.target.value)
                      }
                      disabled={id ? true : false}
                      min={getDateNowIso()}
                      value={order?.dayGet}
                    />
                  </Form.Item>
                </Form>
              </Stack>
            </Card>
            <Box w={"3%"}></Box>
            <Card
              title="Thông tin giao hàng"
              type="inner"
              style={{ width: "48%" }}
            >
              <Stack spacing={4}>
                <Form layout="vertical">
                  <HStack>
                    <Form.Item required label="Số điện thoại người nhận">
                      <Input
                        onChange={(event) =>
                          handleChangeOrder("deliveryPhone", event.target.value)
                        }
                        value={order?.deliveryPhone}
                        disabled={id ? true : false}
                      />
                    </Form.Item>
                    <Form.Item required label="Họ tên người nhận">
                      <Input
                        onChange={(event) =>
                          handleChangeOrder("deliveryTo", event.target.value)
                        }
                        disabled={id ? true : false}
                        value={order?.deliveryTo}
                      />
                    </Form.Item>
                  </HStack>
                  <Form.Item required label="Địa chỉ lấy hàng">
                    <Input
                      onChange={(event) =>
                        handleChangeOrder(
                          "locationDetailDelivery",
                          event.target.value
                        )
                      }
                      w={"94%"}
                      value={order?.locationDetailDelivery}
                      isReadOn
                      disabled={id ? true : false}
                      ly={id ? true : false}
                    />
                  </Form.Item>
                  <HStack>
                    <Select
                      onChange={(event) => {
                        handleChangeOrder("provinceDelivery", event);
                        handleChangeOrder("cityDelivery", event);
                        handleProvinceChange2(event);
                      }}
                      value={order?.provinceDelivery}
                    >
                      {id ? (
                        provincesList2
                          .filter(
                            (province) =>
                              province.province_name === order?.provinceGet
                          )
                          .map((province) => (
                            <option
                              key={province.province_id}
                              value={province.province_id}
                            >
                              {province.province_name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provincesList2.map((province) => (
                            <option
                              key={province.province_id}
                              value={province.province_name}
                            >
                              {province.province_name}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                    <Select
                      onChange={(event) => {
                        handleChangeOrder("districtDelivery", event);
                        handleDistrictChange2(event);
                      }}
                      value={order?.districtDelivery}
                    >
                      {id ? (
                        districtsList2
                          .filter(
                            (district) =>
                              district.district_name === order?.districtDelivery
                          )
                          .map((district) => (
                            <option
                              key={district.district_id}
                              value={district.district_id}
                            >
                              {district.district_name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="">Chọn quận/huyện</option>
                          {districtsList2.map((district) => (
                            <option
                              key={district.id}
                              value={district.district_name}
                            >
                              {district.district_name}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                    <Select
                      onChange={(event) =>
                        handleChangeOrder("wardDelivery", event)
                      }
                      value={order?.wardDelivery}
                    >
                      {id ? (
                        wardsList2
                          .filter(
                            (ward) => ward.ward_name === order?.wardDelivery
                          )
                          .map((ward) => (
                            <option key={ward.ward_id} value={ward.ward_id}>
                              {ward.ward_name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="">Chọn xã/phường</option>
                          {wardsList2.map((ward) => (
                            <option key={ward.id} value={ward.ward_name}>
                              {ward.ward_name}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                  </HStack>
                </Form>
              </Stack>
            </Card>
          </Flex>
          <Stack>
            {order?.items.map((item, index) => (
              <Card
                key={index}
                style={{ marginBottom: "1%" }}
                title={`Tên mặt hàng: ${item?.itemName}`}
                className="order-item"
                extra={
                  !id ? (
                    <>
                      <a
                        style={{ marginRight: "30px", color: "#69b1ff" }}
                        onClick={() => {
                          // let orderItems = [...order?.items];
                          // orderItems.splice(index, 1);
                          // setOrder({ ...order, items: orderItems });
                          setItemSelected(item);
                          setSelectedIndex(index);
                          onOpen();
                        }}
                      >
                        Sửa
                      </a>
                      <a
                        style={{ color: "red" }}
                        onClick={() => {
                          let orderItems = [...order?.items];
                          orderItems.splice(index, 1);
                          setOrder({ ...order, items: orderItems });
                        }}
                      >
                        Xóa
                      </a>
                    </>
                  ) : null
                }
              >
                <Form>
                  <Flex justifyContent={"space-between"}>
                    <HStack>
                      <Form.Item label="Khối lượng">
                        <Input
                          disabled={id ? true : false}
                          value={item?.unitWeight}
                          min={0}
                          type="number"
                        />
                      </Form.Item>
                      <Form.Item label="Số lượng">
                        <Input
                          disabled={id ? true : false}
                          value={item?.quantityItem}
                          min={0}
                          type="number"
                        />
                      </Form.Item>
                    </HStack>
                    <HStack>
                      <Form.Item label="Dài(m)">
                        <Input
                          disabled={id ? true : false}
                          value={item?.length}
                          precision={2}
                          type="number"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item label="Rộng(m)">
                        <Input
                          disabled={id ? true : false}
                          value={item?.width}
                          precision={2}
                          type="number"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item label="Cao(m)">
                        <Input
                          disabled={id ? true : false}
                          value={item?.height}
                          precision={2}
                          type="number"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item label="Màu sắc">
                        <Input
                          disabled={id ? true : false}
                          value={item?.color}
                        />
                      </Form.Item>
                    </HStack>
                  </Flex>
                </Form>
              </Card>
            ))}
          </Stack>
          <Box height={"2%"}></Box>
          {!id && (
            <Card type="inner" title="Thông tin mặt hàng">
              <Form layout="vertical">
                <Flex justifyContent={"space-between"}>
                  <Stack w={"48%"}>
                    <Form.Item label="Tên mặt hàng">
                      <Input
                        disabled={id ? true : false}
                        value={itemData?.itemName}
                        onChange={(e) =>
                          handleItemChange("itemName", e.target.value)
                        }
                      />
                    </Form.Item>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel
                        mb="0"
                        color={"rgba(0, 0, 0, 0.88)"}
                        fontSize={"14px"}
                        fontWeight={"400"}
                      >
                        Bảo hiểm (2% giá trị sản phẩm):
                      </FormLabel>
                      <Switch
                        isChecked={itemData?.insurance}
                        onChange={(e) =>
                          handleItemChange("insurance", e.target.checked)
                        }
                        disabled={id ? true : false}
                      />
                    </FormControl>
                    {itemData?.insurance && (
                      <Form.Item label="Giá trị đơn hàng">
                        <Input
                          disabled={id ? true : false}
                          value={itemData?.unitPrice}
                          precision={2}
                          min={0}
                          type="number"
                          onChange={(valueString) =>
                            handleItemChange(
                              "unitPrice",
                              valueString.target.value
                            )
                          }
                        />
                      </Form.Item>
                    )}
                    <HStack>
                      <Form.Item label="Khối lượng">
                        <Input
                          disabled={id ? true : false}
                          value={itemData?.unitWeight}
                          min={0}
                          type="number"
                          onChange={(valueString) =>
                            handleItemChange(
                              "unitWeight",
                              valueString.target.value
                            )
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Số lượng">
                        <Input
                          disabled={id ? true : false}
                          value={itemData?.quantityItem}
                          min={0}
                          type="number"
                          onChange={(valueString) =>
                            handleItemChange(
                              "quantityItem",
                              valueString.target.value
                            )
                          }
                        />
                      </Form.Item>
                    </HStack>
                    <HStack>
                      <Form.Item label="Dài(m)">
                        <Input
                          disabled={id ? true : false}
                          value={itemData?.length}
                          precision={2}
                          type="number"
                          min={0}
                          onChange={(valueString) =>
                            handleItemChange("length", valueString.target.value)
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Rộng(m)">
                        <Input
                          disabled={id ? true : false}
                          value={itemData?.width}
                          precision={2}
                          type="number"
                          min={0}
                          onChange={(valueString) =>
                            handleItemChange("width", valueString.target.value)
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Cao(m)">
                        <Input
                          disabled={id ? true : false}
                          value={itemData?.height}
                          precision={2}
                          type="number"
                          min={0}
                          onChange={(valueString) =>
                            handleItemChange("height", valueString.target.value)
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Màu sắc">
                        <Input
                          disabled={id ? true : false}
                          value={itemData?.color}
                          onChange={(e) =>
                            handleItemChange("color", e.target.value)
                          }
                        />
                      </Form.Item>
                    </HStack>
                  </Stack>
                  <Stack w={"50%"}>
                    <Form.Item label="Mô tả">
                      <TextArea
                        rows={7}
                        disabled={id ? true : false}
                        value={itemData?.description}
                        onChange={(e) =>
                          handleItemChange("description", e.target.value)
                        }
                      />
                    </Form.Item>
                    <ButtonAntd
                      type="primary"
                      onClick={() => {
                        setOrder({
                          ...order,
                          items: [
                            ...order?.items,
                            {
                              ...itemData,
                              height: parseFloat(itemData?.height),
                              length: parseFloat(itemData?.length),
                              quantityItem: parseInt(itemData?.quantityItem),
                              unitPrice: parseFloat(itemData?.unitPrice),
                              unitWeight: parseFloat(itemData?.unitWeight),
                              width: parseFloat(itemData?.width),
                            },
                          ],
                        });
                        setItemData(defaultItem);
                      }}
                    >
                      Thêm mặt hàng
                    </ButtonAntd>
                  </Stack>
                </Flex>
              </Form>
            </Card>
          )}
        </Stack>
      </Box>
      {orderBill?.expectedDeliveryDate && (
        <Flex
          className="actionbar"
          position={"fixed"}
          bottom={0}
          height={"12vh"}
          w="86.6%"
          right={"16px"}
          background={"white"}
          zIndex={"999999"}
          padding={"1% 2%"}
          boxShadow={"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}
          alignItems={"center"}
        >
          <FormControl>
            <FormLabel>Thời gian giao hàng dự kiến:</FormLabel>
            <Text>{formatDate(orderBill?.expectedDeliveryDate)}</Text>
          </FormControl>
          <FormControl>
            <FormLabel>Giá bảo hiểm đơn hàng:</FormLabel>
            <Text>{formatMoney(Math.ceil(orderBill?.totalInsurance))} VNĐ</Text>
          </FormControl>
          <FormControl>
            <FormLabel>Giá vận chuyển:</FormLabel>
            <Text>{formatMoney(Math.ceil(orderBill?.deliveryPrice))} VNĐ</Text>
          </FormControl>
          {id && userInformation?.role === "Staff" ? (
            <>
              {order.status === 2 && (
                <Flex>
                  <Button
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mr={"8px"}
                    colorScheme="red"
                    onClick={() => handleUpdateOrder(4)}
                  >
                    <FiXCircle style={{ marginRight: "5px" }} />
                    Từ chối
                  </Button>
                  <Button
                    colorScheme="green"
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    onClick={() => handleUpdateOrder(3)}
                  >
                    <FiCheckCircle style={{ marginRight: "5px" }} />
                    Chấp nhận
                  </Button>
                </Flex>
              )}
            </>
          ) : (userInformation?.role === "Staff" ||
              userInformation?.role === "Company") &&
            !id ? (
            <>
              <Flex>
                <Button
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  mr={"8px"}
                >
                  <FiRefreshCw style={{ marginRight: "5px" }} />
                  Làm mới
                </Button>
                <Button
                  colorScheme="blue"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={handleSubmit}
                >
                  <FiBox style={{ marginRight: "5px" }} />
                  Tạo đơn
                </Button>
              </Flex>
            </>
          ) : null}
        </Flex>
      )}
    </>
  );
};
export default CreateOrderForm;
