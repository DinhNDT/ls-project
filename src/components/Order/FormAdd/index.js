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
  Flex,
  Stack,
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
import {
  Card,
  Form,
  Input,
  Select,
  Button as ButtonAntd,
  DatePicker,
  Tooltip,
} from "antd";
import { GlobalContext } from "../../../provider";
import { convertOrder } from "../../../helpers";
import axios from "axios";
import { TbFileImport } from "react-icons/tb";
import TextArea from "antd/es/input/TextArea";
import { OrderContext } from "../../../provider/order";
import { CardOrder } from "../CardOrder";
import dayjs from "dayjs";
import { TableOrder } from "../TableOrder";
import { InputFormatPrice } from "../InputFormatPrice";
import { ReviewOrder } from "../ReviewOrder";
import { AiOutlineArrowRight } from "react-icons/ai";

const { Option } = Select;

const defaultItem = {
  itemName: "",
  insurance: true,
  description: "",
  unitPrice: 0,
  quantityItem: 0,
  unitWeight: 0,
  length: 0,
  width: 0,
  height: 0,
  color: "",
};

export const FORMAT_TIME = "DD/MM/YYYY";
export const FORMAT_TIME_SUBMIT = "YYYY-MM-DD";

const CreateOrderForm = ({ id }) => {
  const userContext = useContext(GlobalContext);
  const { userInformation, headers } = userContext;
  const orderContext = useContext(OrderContext);
  const { setKeySelected } = orderContext;

  const [order, setOrder] = useState({
    orderDate: dayjs().format(FORMAT_TIME_SUBMIT),
    companyId: "",
    dayGet: dayjs().format(FORMAT_TIME_SUBMIT),
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
  const toast = useToast({ position: "top" });
  const [nextToReview, setPrevToReview] = useState(false);

  const onNextToReviewOrder = () => {
    setPrevToReview(true);
  };

  const onBackOrder = () => {
    setPrevToReview(false);
  };

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

  const [companyData, setCompanyData] = useState(null);

  const handleItemChange = (name, value) => {
    setItemData({ ...itemData, [name]: value });
  };

  const handleItemChangeNumber = (name, value) => {
    const newNumber = parseFloat(value || "0", 10);
    if (Number.isNaN(itemData[name])) {
      return;
    }

    setItemData({ ...itemData, [name]: newNumber });
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

  const handleTransferAddress = (companyData) => {
    if (!companyData) return;

    let address = companyData[0]?.companyLocation?.split(",").at(0)?.trim();
    let ward = companyData[0]?.companyLocation?.split(",").at(1)?.trim();
    let district = companyData[0]?.companyLocation?.split(",").at(2)?.trim();
    let province = companyData[0]?.companyLocation?.split(",").at(3)?.trim();
    handleChangeOrder("provinceGet", province);
    handleChangeOrder("cityGet", province);
    handleChangeOrder("districtGet", district);
    handleChangeOrder("wardGet", ward);
    handleChangeOrder("locationDetailGet", address);
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
          handleTransferAddress(companyData);
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
                `/Company?accountId=${data?.company?.accountId}`,
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

  const handleChangeNumber = (name, value) => {
    const newNumber = parseFloat(value || "0", 10);

    if (Number.isNaN(selectedItem[name])) {
      return;
    }

    setItemSelected((prevItem) => ({
      ...prevItem,
      [name]: newNumber,
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
        handleTransferAddress(companyData);
        setCompanyData(companyData[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleProvinceChange = (provinceId) => {
    apiGetPublicDistrict(provinceId);
  };

  const handleProvinceChange2 = (provinceId) => {
    apiGetPublicDistrict2(provinceId);
  };

  const handleDistrictChange = (districtId) => {
    apiGetPublicWard(districtId);
  };

  const handleDistrictChange2 = (districtId) => {
    apiGetPublicWard2(districtId);
  };

  const apiGetPublicProvinces = async () => {
    try {
      const response = await axios.get(
        "https://esgoo.net/api-tinhthanh/1/0.htm"
      );
      setProvincesList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicProvinces2 = async () => {
    try {
      const response = await axios.get(
        "https://esgoo.net/api-tinhthanh/1/0.htm"
      );

      setProvincesList2(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicDistrict = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      setDistrictsList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicDistrict2 = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      setDistrictsList2(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard = async (districtId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );

      setWardsList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard2 = async (districtId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );

      setWardsList2(response.data.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        ...order,
        ...orderBill,
        accountId: userInformation?.accounId,
      };

      if (id) {
        const UpdateOrder = await axios.put("/Order/update-order", payload, {
          headers,
        });
        if (UpdateOrder.status === 200) {
          toast({
            title: "Gửi thông tin đơn hàng thành công!.",
            status: "success",
            isClosable: true,
          });

          setKeySelected("1");
        } else {
          console.log("Can't update order");
        }
      } else {
        const AddCompany = await axios.post("/Order", payload, { headers });
        if (AddCompany.status === 200) {
          toast({
            title: "Đã gửi thông tin đơn hàng!",
            status: "success",
            isClosable: true,
          });
          setKeySelected("1");
        } else {
          toast({
            title: "Không thể tạo đơn!",
            status: "error",
            isClosable: true,
          });
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

            <FormControl isRequired>
              <FormLabel>
                Giá trị đơn hàng (Bảo hiểm 2% giá trị đơn hàng)
              </FormLabel>
              <InputFormatPrice
                valueInput={selectedItem?.unitPrice}
                handleItemChange={handleChangeNumber}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Số lượng</FormLabel>
              <Input
                value={selectedItem?.quantityItem}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("quantityItem", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Khối lượng (kg)</FormLabel>
              <Input
                value={selectedItem?.unitWeight}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("unitWeight", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Dài (cm)</FormLabel>
              <Input
                value={selectedItem?.length}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("length", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Rộng (cm)</FormLabel>
              <Input
                value={selectedItem?.width}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("width", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cao (cm)</FormLabel>
              <Input
                value={selectedItem?.height}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("height", valueString.target.value)
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
    apiGetPublicDistrict("79");
    apiGetPublicProvinces2();
  }, [headers]);

  useEffect(() => {
    if (!id && order) {
      if (checkCompletion(order)) {
        handleCreateResponse();
      }
    }
  }, [id, order]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      if (!order.dayGet) return;
      form.setFieldValue("dayGet", dayjs(order?.dayGet, FORMAT_TIME));
    }
  }, [id, order]);

  return (
    <>
      {!id && !nextToReview && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Button
            position="fixed"
            bottom={"50px"}
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

      {!nextToReview ? (
        <Box
          padding={"0 3%"}
          maxW={"1400px"}
          margin={"0 auto"}
          display={"flex"}
          justifyContent={"center"}
        >
          {ModalItem}
          <Stack width={"100%"}>
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
                        value={order?.companyId}
                      >
                        <Option value="">Chọn công ty</Option>
                        {company.map((company) => (
                          <Option
                            key={company.companyId}
                            value={company.companyId}
                          >
                            {company.companyName}
                          </Option>
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
                      value={companyData?.account?.fullName}
                    />
                  </Form.Item>
                </Flex>
                <Form.Item required label="Địa chỉ">
                  <TextArea
                    placeholder="input placeholder"
                    rows={1}
                    value={companyData?.companyLocation}
                    disabled
                  />
                </Form.Item>
              </Form>
            </Card>
            <Box height={"2%"}></Box>
            <Flex justifyContent={"space-between"} mb={"2px"}>
              <Card
                title="Thông tin gửi hàng"
                type="inner"
                style={{ width: "60%" }}
              >
                <Stack spacing={4}>
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ dayGet: dayjs() }}
                  >
                    <HStack>
                      <Form.Item required label="Số điện thoại">
                        <Input
                          placeholder="Nhập số điện thoại"
                          onChange={(event) =>
                            handleChangeOrder("getPhone", event.target.value)
                          }
                          value={companyData?.account?.phone}
                          disabled={id ? true : false}
                        />
                      </Form.Item>
                      <Form.Item required label="Họ tên">
                        <Input
                          placeholder="Nhập họ tên"
                          onChange={(event) =>
                            handleChangeOrder("getTo", event.target.value)
                          }
                          disabled={id ? true : false}
                          value={companyData?.account?.fullName}
                        />
                      </Form.Item>
                    </HStack>
                    <Form.Item required label="Địa chỉ">
                      <HStack mb={3} mt={1}>
                        <Select
                          onChange={(event, option) => {
                            handleChangeOrder("provinceGet", event);
                            handleChangeOrder("cityGet", event);
                            handleProvinceChange(option.key);
                          }}
                          value={order?.provinceGet}
                          style={{ width: "100%" }}
                        >
                          <Option value="">Chọn tỉnh/thành phố</Option>
                          {provincesList
                            .filter((value) => value.id === "79")
                            .map((province) => (
                              <Option
                                key={province.id}
                                value={province.full_name}
                              >
                                {province.full_name}
                              </Option>
                            ))}
                        </Select>
                        <Select
                          onChange={(event, option) => {
                            handleChangeOrder("districtGet", event);
                            handleDistrictChange(option.key);
                          }}
                          value={order?.districtGet}
                          style={{ width: "100%" }}
                        >
                          <Option value="">Chọn quận/huyện</Option>
                          {districtsList.map((district) => (
                            <Option
                              key={district.id}
                              value={district.full_name}
                            >
                              {district.full_name}
                            </Option>
                          ))}
                        </Select>
                        <Select
                          onChange={(event) =>
                            handleChangeOrder("wardGet", event)
                          }
                          value={order?.wardGet}
                          style={{ width: "100%" }}
                        >
                          <Option value="">Chọn xã/phường</Option>
                          {wardsList.map((ward) => (
                            <Option key={ward.id} value={ward.full_name}>
                              {ward.full_name}
                            </Option>
                          ))}
                        </Select>
                      </HStack>
                      {/* <Form.Item required label="Địa chỉ"> */}
                      <Input
                        placeholder="Nhập địa chỉ"
                        onChange={(event) =>
                          handleChangeOrder(
                            "locationDetailGet",
                            event.target.value
                          )
                        }
                        w={"94%"}
                        value={order?.locationDetailGet}
                        disabled={id ? true : false}
                      />
                    </Form.Item>

                    <Form.Item name="dayGet" required label="Ngày gửi hàng">
                      <DatePicker
                        onChange={(date) => {
                          handleChangeOrder(
                            "dayGet",
                            dayjs(date).format(FORMAT_TIME_SUBMIT)
                          );
                        }}
                        format={FORMAT_TIME}
                        minDate={dayjs()}
                        disabled={!!id}
                      />
                    </Form.Item>
                  </Form>
                </Stack>
              </Card>
              <Box w={"3%"}></Box>
              <Card
                title="Thông tin nhận hàng"
                type="inner"
                style={{ width: "60%" }}
              >
                <Stack spacing={4}>
                  <Form layout="vertical">
                    <HStack>
                      <Form.Item required label="Số điện thoại">
                        <Input
                          placeholder="Nhập số điện thoại"
                          onChange={(event) =>
                            handleChangeOrder(
                              "deliveryPhone",
                              event.target.value
                            )
                          }
                          value={order?.deliveryPhone}
                          disabled={id ? true : false}
                        />
                      </Form.Item>
                      <Form.Item required label="Họ tên">
                        <Input
                          placeholder="Nhập họ tên"
                          onChange={(event) =>
                            handleChangeOrder("deliveryTo", event.target.value)
                          }
                          disabled={id ? true : false}
                          value={order?.deliveryTo}
                        />
                      </Form.Item>
                    </HStack>
                    <Form.Item required label="Địa chỉ">
                      <HStack mt={1} mb={3}>
                        <Select
                          onChange={(event, option) => {
                            handleChangeOrder("provinceDelivery", event);
                            handleChangeOrder("cityDelivery", event);
                            handleProvinceChange2(option.key);
                          }}
                          value={order?.provinceDelivery}
                          style={{ width: "100%" }}
                        >
                          <Option value="">Chọn tỉnh/thành phố</Option>
                          {provincesList2.map((province) => (
                            <Option
                              key={province.id}
                              value={province.full_name}
                            >
                              {province.full_name}
                            </Option>
                          ))}
                        </Select>
                        <Select
                          onChange={(event, option) => {
                            handleChangeOrder("districtDelivery", event);
                            handleDistrictChange2(option.key);
                          }}
                          value={order?.districtDelivery}
                          style={{ width: "100%" }}
                        >
                          <Option value="">Chọn quận/huyện</Option>
                          {districtsList2.map((district) => (
                            <Option
                              key={district.id}
                              value={district.full_name}
                            >
                              {district.full_name}
                            </Option>
                          ))}
                        </Select>
                        <Select
                          onChange={(event) =>
                            handleChangeOrder("wardDelivery", event)
                          }
                          value={order?.wardDelivery}
                          style={{ width: "100%" }}
                        >
                          <Option value="">Chọn xã/phường</Option>
                          {wardsList2.map((ward) => (
                            <Option key={ward.id} value={ward.full_name}>
                              {ward.full_name}
                            </Option>
                          ))}
                        </Select>
                      </HStack>
                      <Input
                        placeholder="Nhập địa chỉ"
                        onChange={(event) =>
                          handleChangeOrder(
                            "locationDetailDelivery",
                            event.target.value
                          )
                        }
                        w={"94%"}
                        value={order?.locationDetailDelivery}
                        disabled={id ? true : false}
                      />
                      {/* <Form.Item required label="Địa chỉ"> */}
                    </Form.Item>
                  </Form>
                </Stack>
              </Card>
            </Flex>
            {!id && (
              <Card type="inner" title="Thông tin mặt hàng">
                <Form layout="vertical">
                  <Flex justifyContent={"space-between"}>
                    <Stack w={"100%"}>
                      <Stack direction="row">
                        <Stack w={"50%"}>
                          <Form.Item label="Tên mặt hàng">
                            <Input
                              placeholder="Nhập tên mặt hàng"
                              disabled={id ? true : false}
                              value={itemData?.itemName}
                              onChange={(e) =>
                                handleItemChange("itemName", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Stack>
                      </Stack>
                      <Form.Item label="Giá trị đơn hàng (Bảo hiểm 2% giá trị đơn hàng)">
                        <InputFormatPrice
                          id={id}
                          hasTooltip={true}
                          valueInput={itemData?.unitPrice}
                          handleItemChange={handleItemChangeNumber}
                        />
                      </Form.Item>
                      <HStack>
                        <Form.Item label="Khối lượng(kg)">
                          <Input
                            disabled={id ? true : false}
                            value={itemData?.unitWeight}
                            min={0}
                            type="number"
                            onChange={(valueString) =>
                              handleItemChangeNumber(
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
                              handleItemChangeNumber(
                                "quantityItem",
                                valueString.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Dài(cm)">
                          <Input
                            disabled={id ? true : false}
                            value={itemData?.length}
                            precision={2}
                            type="number"
                            min={0}
                            onChange={(valueString) =>
                              handleItemChangeNumber(
                                "length",
                                valueString.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Rộng(cm)">
                          <Input
                            disabled={id ? true : false}
                            value={itemData?.width}
                            precision={2}
                            type="number"
                            min={0}
                            onChange={(valueString) =>
                              handleItemChangeNumber(
                                "width",
                                valueString.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Cao(cm)">
                          <Input
                            disabled={id ? true : false}
                            value={itemData?.height}
                            precision={2}
                            type="number"
                            min={0}
                            onChange={(valueString) =>
                              handleItemChangeNumber(
                                "height",
                                valueString.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Màu sắc">
                          <Input
                            placeholder="Nhập màu sắc"
                            disabled={id ? true : false}
                            value={itemData?.color}
                            onChange={(e) =>
                              handleItemChange("color", e.target.value)
                            }
                          />
                        </Form.Item>
                      </HStack>
                      <Form.Item label="Mô tả">
                        <TextArea
                          placeholder="Nhập nội dung"
                          rows={5}
                          disabled={id ? true : false}
                          value={itemData?.description}
                          onChange={(e) =>
                            handleItemChange("description", e.target.value)
                          }
                        />
                      </Form.Item>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                        }}
                      >
                        <ButtonAntd
                          style={{ width: "250px" }}
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
                                  quantityItem: parseInt(
                                    itemData?.quantityItem
                                  ),
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
                      </div>
                    </Stack>
                  </Flex>
                </Form>
              </Card>
            )}
            <Box>
              {id ? (
                <TableOrder order={order} />
              ) : (
                order?.items.map((item, index) => (
                  <CardOrder
                    key={index + item.itemName}
                    id={id}
                    index={index}
                    item={item}
                    order={order}
                    setItemSelected={setItemSelected}
                    setSelectedIndex={setSelectedIndex}
                    onOpen={onOpen}
                    setOrder={setOrder}
                  />
                ))
              )}

              {order?.items.length > 0 ? (
                <Box>
                  <Tooltip
                    title={
                      !orderBill?.expectedDeliveryDate
                        ? "Vui lòng điền các thông tin trên"
                        : ""
                    }
                  >
                    {id ? (
                      <Button
                        bg={"#1677ff"}
                        color={"white"}
                        _hover={{
                          bg: "blue.300",
                        }}
                        marginRight="24px"
                        w="250px"
                        float="right"
                        size="sm"
                        fontWeight="400"
                        // onClick={onNextToReviewOrder}
                      >
                        Xác Nhận Sửa Đơn Hàng
                      </Button>
                    ) : (
                      <Button
                        bg={"#1677ff"}
                        color={"white"}
                        _hover={{
                          bg: "blue.300",
                        }}
                        marginRight="24px"
                        w="250px"
                        float="right"
                        size="sm"
                        fontWeight="400"
                        isDisabled={!orderBill?.expectedDeliveryDate}
                        onClick={onNextToReviewOrder}
                        rightIcon={<AiOutlineArrowRight />}
                      >
                        Tiến Hành Tạo Đơn
                      </Button>
                    )}
                  </Tooltip>
                </Box>
              ) : null}
            </Box>
          </Stack>
        </Box>
      ) : (
        <ReviewOrder
          orderProps={order}
          companyDataProps={companyData}
          orderBill={orderBill}
          onBackOrder={onBackOrder}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
export default CreateOrderForm;
