import {
  InputGroup,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Stack,
  InputRightAddon,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

function ModalItemDetail({
  openModalAdd,
  setOpenModalAdd,
  data = {
    itemId: 2,
    itemName: "Áo thun nam",
    insurance: true,
    unitPrice: 150000,
    quantityItem: 2,
    description:
      "Áo thun nam chất liệu cotton, phù hợp cho mọi hoạt động thường ngày.",
    unitweight: 20,
    width: 8,
    length: 10,
    height: 1,
    color: "Đen",
    itemInsurance: 6000,
    itemWeight: 40,
    itemValue: 300000,
    deleted: false,
    status: 1,
    orderId: 1,
  },
}) {
  const {
    itemId,
    itemName,
    insurance,
    unitPrice,
    quantityItem,
    description,
    unitweight,
    width,
    length,
    height,
    color,
    itemInsurance,
    itemWeight,
    itemValue,
    deleted,
    status,
    orderId,
  } = data;

  // Name, Description, QuantityItem, unitWeight, ItemWeight, OrderId, Statu;
  return (
    <>
      <Modal isOpen={openModalAdd} onClose={() => setOpenModalAdd(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết mặt hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl id="itemName" isRequired>
                <FormLabel>Tên mặt hàng</FormLabel>
                <Input isReadOnly type="text" value={itemName} />
              </FormControl>
              <FormControl id="quantity" isRequired>
                <FormLabel>Số lượng</FormLabel>
                <Input isReadOnly type="text" value={quantityItem} />
              </FormControl>
              <HStack>
                <FormControl id="status" isRequired>
                  <FormLabel>Trạng thái</FormLabel>
                  <Input
                    isReadOnly
                    type="text"
                    value={
                      status === 1
                        ? "Idle"
                        : status === 2
                        ? "In Stock"
                        : status === 3
                        ? "Delivering"
                        : "Completed"
                    }
                  />
                </FormControl>
                <FormControl id="color" isRequired>
                  <FormLabel>Màu sắc</FormLabel>
                  <Input isReadOnly type="text" value={color} />
                </FormControl>
              </HStack>
              {/* <HStack>
                <FormControl id="insurance" isRequired>
                  <FormLabel>Insurance Status</FormLabel>
                  <Input isReadOnly type="text" value={insurance} />
                </FormControl>
                <FormControl id="deleted" isRequired>
                  <FormLabel>Deleted</FormLabel>
                  <Input isReadOnly type="text" value={deleted} />
                </FormControl>
              </HStack> */}
              {/* <HStack>
                <FormControl id="unitPrice" isRequired>
                  <FormLabel>Unit Price</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={unitPrice} />
                    <InputRightAddon>đ</InputRightAddon>
                  </InputGroup>
                </FormControl>
                <FormControl id="itemInsurance" isRequired>
                  <FormLabel>Item Insurance</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={itemInsurance} />
                    <InputRightAddon>đ</InputRightAddon>
                  </InputGroup>
                </FormControl>
              </HStack> */}
              {/* <HStack>
                <FormControl id="width" isRequired>
                  <FormLabel>Width</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={width} />
                    <InputRightAddon>cm</InputRightAddon>
                  </InputGroup>
                </FormControl>
                <FormControl id="height" isRequired>
                  <FormLabel>Height</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={height} />
                    <InputRightAddon>cm</InputRightAddon>
                  </InputGroup>
                </FormControl>
              </HStack> */}
              <HStack>
                <FormControl id="unitWeight" isRequired>
                  <FormLabel>Unit Weight</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={unitweight} />
                    <InputRightAddon>cm</InputRightAddon>
                  </InputGroup>
                </FormControl>
                <FormControl id="itemWeight" isRequired>
                  <FormLabel>Trọng lượng</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={itemWeight} />
                    <InputRightAddon>kg</InputRightAddon>
                  </InputGroup>
                </FormControl>
                {/* <FormControl id="length" isRequired>
                  <FormLabel>Length</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={length} />
                    <InputRightAddon>cm</InputRightAddon>
                  </InputGroup>
                </FormControl> */}
              </HStack>
              {/* <HStack>
                <FormControl id="itemWeight" isRequired>
                  <FormLabel>Item Weight</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={itemWeight} />
                    <InputRightAddon>kg</InputRightAddon>
                  </InputGroup>
                </FormControl>
                <FormControl id="itemValue" isRequired>
                  <FormLabel>Item Value</FormLabel>
                  <InputGroup>
                    <Input isReadOnly type="text" value={itemValue} />
                    <InputRightAddon>đ</InputRightAddon>
                  </InputGroup>
                </FormControl>
              </HStack> */}
              <FormControl id="itemName" isRequired>
                <FormLabel>Order Id</FormLabel>
                <Input isReadOnly type="text" value={orderId} />
              </FormControl>
              <FormControl id="description" isRequired>
                <FormLabel>Mô tả</FormLabel>
                <Textarea value={description} isReadOnly />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="ghost"
              mr={3}
              onClick={() => setOpenModalAdd(false)}
            >
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalItemDetail;
