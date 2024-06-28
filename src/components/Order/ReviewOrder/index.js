import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../provider";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  useToast,
} from "@chakra-ui/react";
import { formatDate, getStatusColor, getStatusTitle } from "../../../helpers";
import { Input, Tag, Tooltip } from "antd";
import { getStatusIcon } from "../Table";
import { TableOrder } from "../TableOrder";
import { FiBox, FiCheckCircle, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { OrderContext } from "../../../provider/order";
import { PaymentOrder } from "../PaymentOrder";

const DEFAULT_ORDER = {
  orderDate: "",
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
};

const Title = ({ children, title }) => (
  <Box display={"flex"} justifyContent={"space-between"}>
    <Text color={"#8d8f93"} fontWeight={500} minW={115}>
      {title}
    </Text>
    <Text fontWeight={500} color={"#6c6c6e"} textAlign={"right"}>
      {children}
    </Text>
  </Box>
);

export const ReviewOrder = ({
  id,
  orderProps,
  companyDataProps,
  onBackOrder,
  orderBill,
  handleSubmit,
}) => {
  const toast = useToast({ position: "top" });
  const userContext = useContext(GlobalContext);
  const orderContext = useContext(OrderContext);
  const { setKeySelected } = orderContext;
  const { userInformation, headers } = userContext;
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [companyData, setCompanyData] = useState({});
  const [value, setValue] = useState("");

  const orderReview = orderProps || order;
  const companyDataReview = companyDataProps || companyData;

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
      const getOrder = await axios.get(`/Order/order?orderId=${id}`, {
        headers,
      });

      if (getOrder.status === 200) {
        let companyData = getOrder.data;
        if (companyData.length) {
          let data = companyData[0];
          setOrder(data);

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
  };

  const handleUpdateOrder = async (status) => {
    try {
      const updateOrder = await axios.put(
        `/Order/api/UpdateOrder?orderId=${order?.orderId}&status=${status}`,
        { headers }
      );
      if (updateOrder.status === 200) {
        toast({
          title:
            status === 4
              ? "Đã từ chối đơn hàng"
              : "Đơn hàng đã được chấp nhận.",
          description: "Cập nhật đơn hàng thành công.",
          status: status === 4 ? "warning" : "success",
          duration: 3000,
          isClosable: true,
        });
        setKeySelected("1");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeInputReason = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (id) {
      handleFetchData();
    }
  }, [id]);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={5}
        mb={10}
      >
        <Box
          backgroundColor={"#fafafa"}
          padding={5}
          borderRadius={10}
          w={500}
          minH={310}
          border={"1px solid #f0f0f0"}
        >
          <Text fontSize={"medium"} fontWeight={550} mb={4}>
            Thông Tin Gửi Hàng:
          </Text>
          <Box display={"flex"} flexDirection={"column"} gap={5}>
            <Title title={"Người Đại Diện:"}>
              {companyDataReview?.account?.fullName}
            </Title>
            <Title title={"Số Điện Thoại:"}>
              {companyDataReview?.account?.phone}
            </Title>
            <Title title={"Ngày Gửi Hàng:"}>
              {formatDate(orderReview?.dayGet)}
            </Title>
            {id ? (
              <Title title={"Trạng Thái:"}>
                <Tag
                  icon={getStatusIcon(orderReview?.status)}
                  color={getStatusColor(orderReview?.status)}
                  key={orderReview?.status}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    marginRight: "unset",
                  }}
                >
                  {getStatusTitle(orderReview?.status)}
                </Tag>
              </Title>
            ) : null}
            <Title
              title={"Địa Chỉ:"}
            >{`${orderReview?.locationDetailGet}, ${orderReview?.wardGet}, ${orderReview?.districtGet}, ${orderReview?.provinceGet}`}</Title>
          </Box>
        </Box>

        <Box
          backgroundColor={"#fafafad4"}
          padding={5}
          borderRadius={10}
          w={500}
          minH={310}
          border={"1px solid #f0f0f0"}
        >
          <Text fontSize={"medium"} fontWeight={550} mb={4}>
            Thông Tin Công Ty:
          </Text>
          <Box display={"flex"} flexDirection={"column"} gap={5}>
            <Title title={"Tên Công Ty:"}>
              {companyDataReview?.companyName}
            </Title>
            {/* <Title title={"Người Đại Diện:"}>
              {companyDataReview?.account?.fullName}
            </Title> */}
            <Title title={"Email:"}>{companyDataReview?.account?.email}</Title>
            <Title title={"Số Điện Thoại:"}>
              {companyDataReview?.account?.phone}
            </Title>
            <Title title={"Địa Chỉ:"}>
              {companyDataReview?.companyLocation}
            </Title>
          </Box>
        </Box>

        <Box
          backgroundColor={"#fafafa"}
          padding={5}
          borderRadius={10}
          w={500}
          minH={310}
          border={"1px solid #f0f0f0"}
        >
          <Text fontSize={"medium"} fontWeight={550} mb={4}>
            Thông Tin Nhận Hàng:
          </Text>
          <Box display={"flex"} flexDirection={"column"} gap={5}>
            <Title title={"Tên Người Nhận:"}>{orderReview?.deliveryTo}</Title>
            <Title title={"Số Điện Thoại:"}>{orderReview?.deliveryPhone}</Title>
            <Title title={"Ngày Giao Hàng Dự Kiến:"}>
              {formatDate(
                orderBill?.expectedDeliveryDate ||
                  orderReview?.expectedDeliveryDate
              )}
            </Title>
            <Title
              title={"Địa Chỉ:"}
            >{`${orderReview?.locationDetailDelivery}, ${orderReview?.wardDelivery}, ${orderReview?.districtDelivery}, ${orderReview?.provinceDelivery}`}</Title>
          </Box>
        </Box>
      </Box>
      <TableOrder order={orderReview} orderBill={orderBill} id={id} />

      {id && userInformation?.role === "Staff" && order.status === 2 && (
        <FormControl
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <FormLabel textAlign={"left"} margin={"unset"} mb="5px">
            Lý do hủy đơn hàng (nếu có):
          </FormLabel>
          <Input.TextArea onChange={onChangeInputReason} />
        </FormControl>
      )}

      {id && userInformation?.role === "Staff" ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {order.status === 2 && (
            <Flex mt={10}>
              <Tooltip title={!value ? "Vui lòng nhập lý do hủy đơn" : ""}>
                <Button
                  isDisabled={!value}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  mr={"8px"}
                  colorScheme="red"
                  onClick={() => handleUpdateOrder(4)}
                  rightIcon={<FiXCircle />}
                >
                  Từ chối
                </Button>
              </Tooltip>
              <Button
                colorScheme="green"
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                onClick={() => handleUpdateOrder(3)}
                rightIcon={<FiCheckCircle />}
              >
                Chấp nhận
              </Button>
            </Flex>
          )}
        </div>
      ) : (userInformation?.role === "Staff" ||
          userInformation?.role === "Company") &&
        !id ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button size="sm" rightIcon={<FiArrowLeft />} onClick={onBackOrder}>
            Quay lại
          </Button>
          <Box>
            <Button
              colorScheme="blue"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              onClick={handleSubmit}
              w={250}
              size="sm"
              rightIcon={<FiBox />}
            >
              Xác Nhận Tạo đơn
            </Button>
          </Box>
        </div>
      ) : null}

      {userInformation?.role === "Company" && order.status === 3 ? (
        <PaymentOrder order={order} orderReview={orderReview} />
      ) : null}
    </>
  );
};
