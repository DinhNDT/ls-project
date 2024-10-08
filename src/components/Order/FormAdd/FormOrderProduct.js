import { Flex, HStack, Stack, Button } from "@chakra-ui/react";
import { Form, Input } from "antd";
import React from "react";
import { InputFormatPrice } from "../InputFormatPrice";
import { defaultItem } from ".";
import axios from "axios";
import { checkCompleFormItem } from "../../../helpers";

export const FormOrderProduct = ({
  id,
  itemData,
  order,
  setOrder,
  setItemData,
  handleItemChange,
  handleItemChangeNumber,
}) => {
  const payloadAddItem = {
    ...itemData,
    height: parseFloat(itemData?.height) / 100,
    length: parseFloat(itemData?.length) / 100,
    quantityItem: parseInt(itemData?.quantityItem),
    unitPrice: parseFloat(itemData?.unitPrice),
    unitWeight: parseFloat(itemData?.unitWeight),
    width: parseFloat(itemData?.width) / 100,
  };

  const handleAddItem = async () => {
    setOrder({
      ...order,
      items: [...order?.items, payloadAddItem],
    });
    setItemData(defaultItem);

    if (id) {
      try {
        await axios.post(
          `/Order/createItem?orderId=${order.orderId}`,
          payloadAddItem
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Form layout="vertical">
      <Flex justifyContent={"space-between"}>
        <Stack w={"100%"}>
          <Stack direction="row">
            <Stack w={"100%"}>
              <Form.Item label="Tên mặt hàng">
                <Input
                  placeholder="Nhập tên mặt hàng"
                  value={itemData?.itemName}
                  onChange={(e) => handleItemChange("itemName", e.target.value)}
                />
              </Form.Item>
            </Stack>
          </Stack>
          <Form.Item label="Giá trị mặt hàng (Bảo hiểm 2% giá trị đơn hàng)">
            <InputFormatPrice
              width="50%"
              id={id}
              hasTooltip={true}
              valueInput={itemData?.unitPrice}
              handleItemChange={handleItemChangeNumber}
            />
          </Form.Item>
          <Stack>
            <HStack justifyContent={"space-between"}>
              <Form.Item label="Khối lượng(kg)" style={{ width: "50%" }}>
                <Input
                  value={itemData?.unitWeight}
                  min={0}
                  type="number"
                  onChange={(valueString) =>
                    handleItemChangeNumber(
                      "unitWeight",
                      valueString.target.value
                    )
                  }
                />
              </Form.Item>
              <Form.Item label="Màu sắc" style={{ width: "50%" }}>
                <Input
                  placeholder="Nhập màu sắc"
                  value={itemData?.color}
                  onChange={(e) => handleItemChange("color", e.target.value)}
                />
              </Form.Item>
            </HStack>
            <HStack>
              <Form.Item label="Số lượng" style={{ width: "50%" }}>
                <Input
                  addonAfter="kiện"
                  value={itemData?.quantityItem}
                  min={0}
                  // max={200}
                  type="number"
                  onChange={(valueString) =>
                    handleItemChangeNumber(
                      "quantityItem",
                      valueString.target.value
                    )
                  }
                />
              </Form.Item>
              <Form.Item
                label="Số lượng sản phẩm trong kiện"
                style={{ width: "50%" }}
              >
                <Input
                  value={itemData?.quantityOfPackage}
                  min={0}
                  type="number"
                  onChange={(valueString) =>
                    handleItemChangeNumber(
                      "quantityOfPackage",
                      valueString.target.value
                    )
                  }
                />
              </Form.Item>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Form.Item label="Dài(cm)">
                <Input
                  value={itemData?.length}
                  precision={2}
                  type="number"
                  min={0}
                  onChange={(valueString) =>
                    handleItemChangeNumber("length", valueString.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Rộng(cm)">
                <Input
                  value={itemData?.width}
                  precision={2}
                  type="number"
                  min={0}
                  onChange={(valueString) =>
                    handleItemChangeNumber("width", valueString.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Cao(cm)">
                <Input
                  value={itemData?.height}
                  precision={2}
                  type="number"
                  min={0}
                  onChange={(valueString) =>
                    handleItemChangeNumber("height", valueString.target.value)
                  }
                />
              </Form.Item>
            </HStack>
          </Stack>
          <Form.Item label="Mô tả">
            <Input.TextArea
              placeholder="Nhập nội dung"
              rows={5}
              value={itemData?.description}
              onChange={(e) => handleItemChange("description", e.target.value)}
            />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              width={250}
              bg={"#2b6cb0"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              size="sm"
              fontWeight="400"
              onClick={handleAddItem}
              isDisabled={!checkCompleFormItem(payloadAddItem)}
            >
              Thêm mặt hàng
            </Button>
          </div>
        </Stack>
      </Flex>
    </Form>
  );
};
