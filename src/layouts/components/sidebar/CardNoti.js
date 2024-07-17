import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { OrderContext } from "../../../provider/order";

export const CardNoti = ({ role, data, setShowNoti }) => {
  const orderContext = useContext(OrderContext);
  const { setKeySelected, setSelectedItem } = orderContext;

  const handleRenderIcon = () => {
    if (role === "Staff" && data.content.includes("đơn hàng mới")) {
      return <AiOutlineClockCircle fontSize="22px" color="#3058a0" />;
    }

    if (role === "Company") {
      if (data.content.includes("hủy")) {
        return <AiOutlineCloseCircle fontSize="22px" color="#db0032" />;
      }
      if (data.content.includes("được phê duyệt")) {
        return <AiOutlineCheckCircle fontSize="22px" color="#3f982b" />;
      }
    }

    return <AiOutlineInfoCircle fontSize="22px" color="#ffdc00" />;
  };

  const handleRenderMes = () => {
    if (role === "Staff") {
      if (data.content.includes("đơn hàng mới")) {
        return (
          <>
            Bạn có đơn hàng{" "}
            <span style={{ color: "#1677ff" }}>{data.orderId}</span> mới cần xem
          </>
        );
      }

      return <>{data.content}</>;
    }

    if (role === "Company") {
      if (data.content.includes("hủy")) {
        return (
          <>
            Đơn hàng <span style={{ color: "#1677ff" }}>{data.orderId}</span>{" "}
            của bạn đã bị hủy
            <br />
            <span
              style={{
                color: "#B2B2B2",
                fontStyle: "italic",
                fontSize: "12px",
              }}
            >
              Lý do: {data.content?.split("vì")?.at(1) ?? ""}
            </span>
          </>
        );
      }
      if (data.content.includes("được phê duyệt")) {
        return (
          <>
            Đơn hàng <span style={{ color: "#1677ff" }}>{data.orderId}</span>{" "}
            của bạn đã được phê duyệt vui lòng thanh toán
          </>
        );
      }
    }

    return <>{data.content}</>;
  };

  const onClickNoti = () => {
    setKeySelected("0A");
    setSelectedItem({ orderId: data.orderId });
    setShowNoti(false);
  };

  return (
    <Flex
      _hover={{
        backgroundColor: "#fafafa",
      }}
      cursor={"pointer"}
      borderBottom={"1px solid #cccccc"}
      alignItems={"center"}
      minW={250}
      gap={3}
      p={3}
      onClick={onClickNoti}
    >
      <Box>{handleRenderIcon()}</Box>
      <div>
        <Text fontSize="small" fontWeight={500}>
          {handleRenderMes()}
        </Text>
      </div>
    </Flex>
  );
};
