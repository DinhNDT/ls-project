import { Box, Button } from "@chakra-ui/react";
import { Tooltip } from "antd";
import React, { useContext, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { OrderContext } from "../../../provider/order";

export const FormAction = ({
  handleSubmit,
  order,
  orderBill,
  onNextToReviewOrder,
}) => {
  const orderContext = useContext(OrderContext);
  const { keySelected } = orderContext;
  const [loading, setLoading] = useState(false);
  const onClickCreate = () => {
    setLoading(true);

    setTimeout(() => onNextToReviewOrder(), 1500);
  };

  const onClickUpdate = (e) => {
    setLoading(true);

    setTimeout(() => {
      handleSubmit(e);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {order?.items.length > 0 ? (
        <Box>
          <Tooltip
            title={
              !orderBill?.expectedDeliveryDate
                ? "Vui lòng điền các thông tin trên"
                : ""
            }
          >
            {keySelected === "2A" || keySelected === "2" ? (
              <Button
                isLoading={loading}
                bg={"#2b6cb0"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                w="250px"
                float="right"
                size="sm"
                fontWeight="400"
                // isDisabled={!orderBill?.expectedDeliveryDate}
                onClick={onClickCreate}
                rightIcon={<AiOutlineArrowRight />}
              >
                Tiến Hành Tạo Đơn
              </Button>
            ) : (
              <Button
                isLoading={loading}
                bg={"#2b6cb0"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                w="250px"
                float="right"
                size="sm"
                fontWeight="400"
                onClick={onClickUpdate}
              >
                Xác Nhận Sửa Đơn Hàng
              </Button>
            )}
          </Tooltip>
        </Box>
      ) : null}
    </>
  );
};
