import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { Input } from "antd";
import React from "react";
import { InputFormatPrice } from "../InputFormatPrice";

export const ModalUpdateOrderProduct = ({
  isOpen,
  onClose,
  selectedItem,
  handleChange,
  handleChangeNumber,
  handleUpdateItem,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật mặt hàng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tên mặt hàng</FormLabel>
              <Input
                value={selectedItem?.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                Giá trị đơn hàng (Bảo hiểm 2% giá trị đơn hàng)
              </FormLabel>
              <InputFormatPrice
                valueInput={selectedItem?.unitPrice}
                handleItemChange={handleChangeNumber}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Số lượng</FormLabel>
              <Input
                value={selectedItem?.quantityItem}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("quantityItem", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Khối lượng (kg)</FormLabel>
              <Input
                value={selectedItem?.unitWeight}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("unitWeight", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Dài (cm)</FormLabel>
              <Input
                value={selectedItem?.length}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("length", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Rộng (cm)</FormLabel>
              <Input
                value={selectedItem?.width}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("width", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cao (cm)</FormLabel>
              <Input
                value={selectedItem?.height}
                precision={2}
                min={0}
                type="number"
                onChange={(valueString) =>
                  handleChangeNumber("height", valueString.target.value)
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Màu sắc</FormLabel>
              <Input
                value={selectedItem?.color}
                onChange={(e) => handleChange("color", e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mô tả</FormLabel>
              <Input.TextArea
                value={selectedItem?.description}
                cols={6}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" onClick={handleUpdateItem}>
            Sửa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
