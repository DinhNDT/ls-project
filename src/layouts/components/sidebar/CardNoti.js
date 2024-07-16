import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

export const CardNoti = () => {
  return (
    <Flex
      border={"1px solid #cccccc"}
      borderRadius={6}
      alignItems={"center"}
      minW={250}
      gap={3}
      p={2}
    >
      <Box>
        <AiOutlineClockCircle fontSize="22px" />
      </Box>
      <div>
        <Text>Đơn hàng 321 đã bị từ chối</Text>
        {/* <Text>123</Text> */}
      </div>
    </Flex>
  );
};
