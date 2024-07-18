import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { OrderContext } from "../../../provider/order";
import axios from "axios";

export const CardNoti = ({ role, data, setShowNoti, setReload }) => {
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

    if (role === "Stocker") {
      return (
        <>
          Bạn có đơn hàng{" "}
          <span style={{ color: "#1677ff" }}>{data.orderId}</span> cần xác nhận
          vui lòng kiểm tra
        </>
      );
    }

    return <>{data.content}</>;
  };

  const apiUpdateSeenStatusNoti = async () => {
    try {
      const statusPUT = await axios.put(
        `/Notification/notification/update-status/${data.notifictionId}?status=false`
      );
      if (statusPUT.status === 200) {
        setReload(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickNoti = () => {
    if (role === "Stocker") {
      setKeySelected("2");
    } else {
      setKeySelected("0A");
      setSelectedItem({ orderId: data.orderId });
    }
    setShowNoti(false);
    apiUpdateSeenStatusNoti();
  };

  return (
    <Flex
      _hover={{
        backgroundColor: "#fafafa",
      }}
      cursor={"pointer"}
      borderBottom={"1px solid #cccccc"}
      alignItems={"center"}
      minW={300}
      gap={3}
      p={3}
      onClick={onClickNoti}
      position="relative"
    >
      <Box>{handleRenderIcon()}</Box>
      <div>
        <Text fontSize="small" fontWeight={500}>
          {handleRenderMes()}
        </Text>
      </div>
      {data?.status ? (
        <div
          style={{
            position: "absolute",
            right: 10,
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "#1677ff",
          }}
        ></div>
      ) : null}
    </Flex>
  );
};
