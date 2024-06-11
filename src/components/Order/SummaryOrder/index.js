import { Button, Flex, FormControl, FormLabel, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { formatDate, formatMoney } from "../../../helpers";
import { FiBox, FiCheckCircle, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { Col, Row } from "antd";

export const SummaryOrder = ({
  id,
  orderBill,
  userInformation,
  order,
  handleUpdateOrder,
  handleSubmit,
}) => {
  const totalItem = useMemo(
    () =>
      order?.items?.reduce((total, current) => {
        return (total += current.quantityItem);
      }, 0),
    [order]
  );

  return (
    <Flex
      className="actionbar"
      justifyContent={"center"}
      flexDirection={"column"}
      gap={25}
    >
      <Row style={{ gap: 45, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <FormControl display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Col span={14}>
            <FormLabel textAlign={"left"} width={"100%"} margin={"unset"}>
              Thời gian giao hàng dự kiến:
            </FormLabel>
          </Col>
          <Col span={10}>
            <Text textAlign={"left"} color={"#4096ff"}>
              {formatDate(orderBill?.expectedDeliveryDate)}
            </Text>
          </Col>
        </FormControl>
        <FormControl display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Col span={14}>
            <FormLabel textAlign={"left"} margin={"unset"}>Giá bảo hiểm đơn hàng:</FormLabel>
          </Col>
          <Col span={10}>
            <Text textAlign={"left"} color={"#4096ff"}>
              {formatMoney(Math.ceil(orderBill?.totalInsurance))} VNĐ
            </Text>
          </Col>
        </FormControl>

        <FormControl display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Col span={14}>
            <FormLabel textAlign={"left"} margin={"unset"}>Giá vận chuyển:</FormLabel>
          </Col>
          <Col span={10}>
            <Text color={"#4096ff"} textAlign={"left"}>
              {formatMoney(Math.ceil(orderBill?.deliveryPrice))} VNĐ
            </Text>
          </Col>
        </FormControl>

        <FormControl display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Col span={14}>
            <FormLabel textAlign={"left"} margin={"unset"}>Khoảng cách vận chuyển:</FormLabel>
          </Col>
          <Col span={10}>
            <Text textAlign={"left"} color={"#4096ff"}>
              {orderBill?.distance} Km
            </Text>
          </Col>
        </FormControl>

        <FormControl display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Col span={14}>
            <FormLabel textAlign={"left"} margin={"unset"}>Tổng số lượng sản phẩm:</FormLabel>
          </Col>
          <Col span={10}>
            <Text textAlign={"left"} color={"#4096ff"}>
              {totalItem}
            </Text>
          </Col>
        </FormControl>

        <FormControl display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Col span={14}>
            <FormLabel textAlign={"left"} margin={"unset"}>Khối lượng tổng:</FormLabel>
          </Col>
          <Col span={10}>
            <Text textAlign={"left"} color={"#4096ff"}>
              {orderBill?.totalWeight} Kg
            </Text>
          </Col>
        </FormControl>
      </Row>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
        ) : null}
      </div>
    </Flex>
  );
};
