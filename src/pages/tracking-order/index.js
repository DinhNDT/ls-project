import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import React from "react";
import { StepTracking } from "./step";
import { TableItem } from "./table-item";

const TrackingOrder = () => {
  return (
    <Box
      backgroundColor="white"
      boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      borderRadius={5}
      p={5}
      width={1200}
    >
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize={"36px"}>Từ</Text>
          <Text width={280}>
            150 Võ Văn Kiệt, Phường Tăng Nhơn Phú B, Thành phố Thủ Đức, Thành
            phố Hồ Chí Minh
          </Text>
        </Box>
        <Box w={150}>
          <Text fontSize={"26px"}>
            Hoàn thành <br /> <Text fontSize="33px">45%</Text>
          </Text>
          <Progress value={45} colorScheme="pink" borderRadius={5} />
        </Box>
        <Box textAlign={"right"}>
          <Text fontSize={"36px"}>Đến</Text>
          <Text width={280}>
            150 Võ Văn Kiệt, Phường Tăng Nhơn Phú B, Thành phố Thủ Đức, Thành
            phố Hồ Chí Minh
          </Text>
        </Box>
      </Flex>
      <Box mt={"40px"}>
        <StepTracking />
      </Box>
      <Box mt={"40px"}>
        <TableItem />
      </Box>
    </Box>
  );
};

export default TrackingOrder;
