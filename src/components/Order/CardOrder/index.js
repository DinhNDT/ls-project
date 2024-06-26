import { Box, Flex, HStack, Stack } from "@chakra-ui/react";
import { Card, Form, Input } from "antd";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export const CardOrder = ({
  id,
  index,
  item,
  order,
  setItemSelected,
  setSelectedIndex,
  onOpen,
  setOrder,
}) => {
  const [isHidingDetail, setIsHidingDetail] = useState(false);
  return (
    <Card
      styles={{ body: { display: isHidingDetail ? "none" : "" } }}
      style={{ marginBottom: "1%" }}
      title={
        <Box>
          <Stack spacing={2} direction="row">
            <div>
              Tên mặt hàng:{" "}
              <span style={{ color: "#4096ff" }}>{item?.itemName}</span>
            </div>
          </Stack>
        </Box>
      }
      className="order-item"
      extra={
        !id ? (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={5}
          >
            <button
              onClick={() => {
                setIsHidingDetail(!isHidingDetail);
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>Chi tiết</span>
              {isHidingDetail ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
            <button
              style={{ color: "#69b1ff" }}
              onClick={() => {
                // let orderItems = [...order?.items];
                // orderItems.splice(index, 1);
                // setOrder({ ...order, items: orderItems });
                setItemSelected(item);
                setSelectedIndex(index);
                onOpen();
              }}
            >
              Sửa
            </button>
            <button
              style={{ color: "red" }}
              onClick={() => {
                let orderItems = [...order?.items];
                orderItems.splice(index, 1);
                setOrder({ ...order, items: orderItems });
              }}
            >
              Xóa
            </button>
          </Box>
        ) : null
      }
    >
      {!isHidingDetail && (
        <Form>
          <Flex justifyContent={"space-between"}>
            <HStack>
              <Form.Item label="Khối lượng(kg)">
                <Input
                  disabled={id ? true : false}
                  value={item?.unitWeight}
                  min={0}
                  type="number"
                />
              </Form.Item>
              <Form.Item label="Số lượng">
                <Input
                  disabled={id ? true : false}
                  value={item?.quantityItem}
                  min={0}
                  type="number"
                />
              </Form.Item>
              <Form.Item label="Dài(cm)">
                <Input
                  disabled={id ? true : false}
                  value={item?.length}
                  precision={2}
                  type="number"
                  min={0}
                />
              </Form.Item>
              <Form.Item label="Rộng(cm)">
                <Input
                  disabled={id ? true : false}
                  value={item?.width}
                  precision={2}
                  type="number"
                  min={0}
                />
              </Form.Item>
              <Form.Item label="Cao(cm)">
                <Input
                  disabled={id ? true : false}
                  value={item?.height}
                  precision={2}
                  type="number"
                  min={0}
                />
              </Form.Item>
              <Form.Item label="Màu sắc">
                <Input disabled={id ? true : false} value={item?.color} />
              </Form.Item>
            </HStack>
          </Flex>
          <Form.Item label="Mô tả">
            <Input.TextArea
              disabled={id ? true : false}
              value={item?.description}
              style={{ width: "calc(100% - 54px)", marginLeft: 54 }}
            />
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};
