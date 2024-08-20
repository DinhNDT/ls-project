import { Box, Button, Flex, Progress, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { STEPS_TRACKING, StepTracking } from "./step";
import { TableItem } from "./table-item";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Result, Spin, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getStatusIcon } from "../../components/Order/Table";
import { getStatusColor, getStatusTitle } from "../../helpers";

const TrackingOrder = () => {
  const { id } = useParams("id");
  const navigate = useNavigate();
  const [dataOrder, setDataOrder] = useState();
  const [loading, setLoading] = useState(true);

  const handleFetchData = async () => {
    try {
      const dataOrderGet = await axios.get(`/Order/order?trackingNumber=${id}`);
      if (dataOrderGet.status === 200) {
        setDataOrder(dataOrderGet.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const genStatus = (id) => {
    const status = {
      7: 5,
    };
    return status[id] || id;
  };

  const percent =
    ((STEPS_TRACKING.findIndex(
      (value) => value.key === genStatus(dataOrder?.status)
    ) +
      1) /
      5) *
    100;

  useEffect(() => {
    handleFetchData();
    const timeout = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Box
      backgroundColor="white"
      boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      borderRadius={5}
      p={5}
      width={{ base: "600px", md: "600px", lg: "1200px" }}
      marginLeft={"10px"}
      marginRight={"10px"}
      marginTop={"20px"}
      marginBottom={"20px"}
    >
      <Flex gap={"8px"} alignItems="center">
        <Text fontSize={"20px"}>Mã đơn hàng</Text>
        <Tag
          color={"green"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            marginTop: "2px",
            fontSize: "14px",
          }}
        >
          {dataOrder?.orderId}
        </Tag>
      </Flex>
      {loading ? (
        <div
          style={{
            height: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 48, color: "red" }} spin />
            }
          />
        </div>
      ) : dataOrder ? (
        <>
          <Box w={"100%"} display={{ base: "unset", md: "unset", lg: "none" }}>
            <Flex
              justifyContent="space-between"
              flexDirection={{
                base: "column-reverse",
                sm: "unset",
                md: "unset",
                lg: "column-reverse",
              }}
            >
              <Text fontSize="21px">Tiến trình {percent}%</Text>
              <Flex
                alignItems="center"
                gap={"10px"}
                justifyContent="space-between"
              >
                <Flex gap={"8px"} alignItems="center">
                  <Text fontSize={"20px"}>Trạng thái</Text>
                  <Tag
                    icon={getStatusIcon(dataOrder?.status)}
                    color={getStatusColor(dataOrder?.status)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      marginTop: "2px",
                      fontSize: "14px",
                    }}
                  >
                    {getStatusTitle(dataOrder?.status)}
                  </Tag>
                </Flex>
              </Flex>
            </Flex>
            <Progress value={percent} colorScheme="pink" borderRadius={5} />
          </Box>
          <Flex
            justifyContent={{
              base: "normal",
              md: "normal",
              lg: "space-between",
            }}
            flexDirection={{
              base: "column",
              md: "column",
              lg: "unset",
            }}
            mb={"25px"}
            mt={"5px"}
          >
            <Box>
              <Text fontSize={{ base: "26px", md: "26px", lg: "36px" }}>
                Từ
              </Text>
              <Text as="i" fontWeight={500}>
                {`${dataOrder?.company?.companyName} - 0906735659`}
              </Text>
              <Text
                width={{
                  base: "100%",
                  md: "100%",
                  lg: "280px",
                }}
              >
                <span style={{ fontWeight: "500", fontStyle: "italic" }}>
                  Đ/c:{" "}
                </span>
                {`${dataOrder?.locationDetailGet}, ${dataOrder?.wardGet}, ${dataOrder?.districtGet}, ${dataOrder?.provinceGet}`}
              </Text>
            </Box>
            <Box w={150} display={{ base: "none", md: "none", lg: "unset" }}>
              <Text fontSize={"26px"}>Hoàn thành</Text>
              <Text fontSize="33px">{percent}%</Text>
              <Progress value={percent} colorScheme="pink" borderRadius={5} />
            </Box>
            <Box
              textAlign={{
                base: "unset",
                md: "unset",
                lg: "right",
              }}
            >
              <Text fontSize={{ base: "26px", md: "26px", lg: "36px" }}>
                Đến
              </Text>
              <Text as="i" fontWeight={500}>
                {`${dataOrder?.deliveryTo} - ${dataOrder?.deliveryPhone}`}
              </Text>
              <Text
                width={{
                  base: "100%",
                  md: "100%",
                  lg: "280px",
                }}
              >
                <span style={{ fontWeight: "500", fontStyle: "italic" }}>
                  Đ/c:{" "}
                </span>
                {`${dataOrder?.locationDetailDelivery}, ${dataOrder?.wardDelivery}, ${dataOrder?.districtDelivery}, ${dataOrder?.provinceDelivery}`}
              </Text>
            </Box>
          </Flex>
          <Box display={{ base: "none", md: "none", lg: "unset" }}>
            <StepTracking status={genStatus(dataOrder?.status)} />
          </Box>
          <Box mt={"40px"}>
            <TableItem data={dataOrder?.items} />
          </Box>
        </>
      ) : (
        <Result
          status="warning"
          title="Xem đơn hàng thất bại."
          subTitle="Đơn hàng bị xóa hoặc không tồn tại, vui lòng thử lại."
          extra={
            <Button colorScheme="teal" size="md" onClick={() => navigate("/")}>
              Quay lại
            </Button>
          }
        />
      )}
    </Box>
  );
};

export default TrackingOrder;
