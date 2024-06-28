import { Box, Button, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { generateSignature } from "../../../helpers/payment";
import { usePayOS } from "payos-checkout";
import { Flex, Modal } from "antd";
import { AiFillNotification } from "react-icons/ai";
import { OrderContext } from "../../../provider/order";

const PayOS_Client_ID = "d7e80324-10cc-4712-bc94-3b2da33b7ae1";
const PayOS_Api_Key = "e77c1e4a-3053-4dab-b7ca-f978ee24fc69";
const PayOS_Checksum_Key =
  "15d88a55456ee28786f00d8dfa08a19093e32437b48d05e2d78597d0b6ce9065";
const Return_URL = "http://localhost:3000/staff/manage-order";
const Cancel_URL = "http://localhost:3000/staff/manage-order";

const CODE_STATUS = {
  Success: "00",
  Failed: "01",
  InvalidParam: "02",
};

const OrderIdTest = 826;

export const PaymentOrder = ({ order, orderReview }) => {
  const summaryOrder = {
    orderCode: order.orderId,
    amount: order?.deliveryPrice,
    description: "Test thanh toan",
    buyerName: orderReview?.deliveryTo,
    buyerPhone: orderReview?.deliveryPhone,
    buyerAddress: `${orderReview?.locationDetailDelivery}, ${orderReview?.wardDelivery}, ${orderReview?.districtDelivery}, ${orderReview?.provinceDelivery}`,
    items: order.items.map((value) => {
      return {
        name: value.itemName,
        quantity: value.quantityItem,
        price: value.unitPrice,
      };
    }),
    cancelUrl: Cancel_URL,
    returnUrl: Return_URL,
  };
  const orderContext = useContext(OrderContext);
  const { setKeySelected } = orderContext;
  const toast = useToast({ position: "top" });
  const [responsePayOs, setResponsePayOs] = useState({
    code: "",
    desc: "",
    checkoutURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const { open } = usePayOS({
    RETURN_URL: Return_URL, // required
    ELEMENT_ID: "root", // required
    CHECKOUT_URL: responsePayOs.checkoutURL, // required
    onSuccess: () => {
      toast({
        title: "Thanh toán đơn hàng thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setKeySelected("1");
    },
    onCancel: () => {
      cancelPaymentLink(order.orderId, "Đã hủy thanh toán đơn hàng.");
      setKeySelected("1");
    },
    onExit: () => {
      cancelPaymentLink(
        order.orderId,
        "Thanh toán đơn hàng bị hủy do bạn đóng popup."
      );
      setKeySelected("1");
    },
  });

  const apiCancelPaymentLink = async (id, title) => {
    try {
      const dataPaymentLink = await axios.post(
        `https://api-merchant.payos.vn/v2/payment-requests/${id}/cancel`,
        {
          cancellationReason: "Đơn hàng bị hủy",
        },
        {
          "Content-Type": "application/json",
          headers: {
            "x-client-id": PayOS_Client_ID,
            "x-api-key": PayOS_Api_Key,
          },
        }
      );
      if (dataPaymentLink.status === 200) {
        toast({
          title: title,
          description: `Đơn hàng ${id} chưa được thanh toán.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const apiCreatePaymentLink = async (submitOrder) => {
    try {
      const dataPaymentLink = await axios.post(
        "https://api-merchant.payos.vn/v2/payment-requests",
        submitOrder,
        {
          "Content-Type": "application/json",
          headers: {
            "x-client-id": PayOS_Client_ID,
            "x-api-key": PayOS_Api_Key,
          },
        }
      );
      const res = dataPaymentLink.data;
      if (dataPaymentLink.status === 200) {
        setResponsePayOs({
          checkoutURL: res?.data?.checkoutUrl,
          code: res.code,
          desc: res.desc,
        });
        if (res.code === "231" && res.desc === "Đơn thanh toán đã tồn tại") {
          setShowModalConfirm(true);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const createPaymentLink = () => {
    setLoading(true);
    const {
      buyerAddress,
      buyerEmail,
      buyerName,
      buyerPhone,
      items,
      signature,
      ...rest
    } = summaryOrder;

    const submitOrder = {
      ...summaryOrder,
      signature: generateSignature({ ...rest }, PayOS_Checksum_Key),
    };

    apiCreatePaymentLink(submitOrder);
  };

  const cancelPaymentLink = (id, title) => {
    apiCancelPaymentLink(id, title);
  };

  const handleOk = () => {
    setShowModalConfirm(false);
    // createPaymentLink();
  };

  const handleCancel = () => {
    setShowModalConfirm(false);
  };

  useEffect(() => {
    if (
      responsePayOs.code === CODE_STATUS.Success &&
      responsePayOs.checkoutURL !== ""
    ) {
      open();
    }
  }, [loading, open, responsePayOs]);

  useEffect(() => {
    const handleLoad = () => {
      axios.post(
        `https://api-merchant.payos.vn/v2/payment-requests/${order.orderId}/cancel`,
        {
          cancellationReason: "Đơn hàng bị hủy",
        },
        {
          "Content-Type": "application/json",
          headers: {
            "x-client-id": PayOS_Client_ID,
            "x-api-key": PayOS_Api_Key,
          },
        }
      );
    };

    window.addEventListener("beforeunload", handleLoad);

    return () => {
      window.removeEventListener("beforeunload", handleLoad);
    };
  }, [responsePayOs]);

  return (
    <>
      <Box h={50}>
        <Button
          colorScheme="green"
          float={"right"}
          onClick={() => createPaymentLink()}
          isLoading={loading}
        >
          Tiến Hành Thanh Toán
        </Button>
      </Box>
      <Modal
        title={
          <Flex gap={10}>
            <AiFillNotification color="#faad14" fontSize={26} /> Thông báo !
          </Flex>
        }
        open={showModalConfirm}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* <Text align={"center"} fontWeight={500} fontSize={16} p={3}>
          Đơn hàng này <span style={{ color: "#4096ff" }}>Đã Thanh Toán</span>{" "}
          hoặc bị <span style={{ color: "#4096ff" }}>Hủy Thanh Toán</span>.
        </Text> */}
        <Text align={"center"} fontWeight={500} fontSize={17} p={5}>
          Đơn hàng nãy đã bị{" "}
          <span style={{ color: "#4096ff" }}>Hủy Thanh Toán</span> trước đó, bạn
          có muốn thực hiện{" "}
          <span style={{ color: "#4096ff" }}>Thanh Toán Lại</span> không?
        </Text>
      </Modal>
    </>
  );
};
