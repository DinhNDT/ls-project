import { Box, Button, Flex, Progress, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { STEPS_TRACKING, StepTracking } from "./step";
import { TableItem } from "./table-item";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Result, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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

  const percent =
    ((STEPS_TRACKING.findIndex((value) => value.key === dataOrder?.status) +
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
      width={1200}
    >
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
          <Flex justifyContent="space-between">
            <Box>
              <Text fontSize={"36px"}>Từ</Text>
              <Text width={280}>
                {`${dataOrder?.locationDetailGet}, ${dataOrder?.wardGet}, ${dataOrder?.districtGet}, ${dataOrder?.provinceGet}`}
              </Text>
            </Box>
            <Box w={150}>
              <Text fontSize={"26px"}>Hoàn thành</Text>
              <Text fontSize="33px">{percent}%</Text>
              <Progress value={percent} colorScheme="pink" borderRadius={5} />
            </Box>
            <Box textAlign={"right"}>
              <Text fontSize={"36px"}>Đến</Text>
              <Text
                width={280}
              >{`${dataOrder?.locationDetailDelivery}, ${dataOrder?.wardDelivery}, ${dataOrder?.districtDelivery}, ${dataOrder?.provinceDelivery}`}</Text>
            </Box>
          </Flex>
          <Box mt={"40px"}>
            <StepTracking status={dataOrder?.status} />
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
