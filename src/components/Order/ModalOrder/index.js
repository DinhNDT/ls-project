import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Table } from "antd";
import { formatMoney } from "../../../helpers";

const columns = [
  {
    title: "Tỉnh/Thành phố",
    dataIndex: "cityDelivery",
  },
  {
    title: "Quận/Huyện",
    dataIndex: "districtDelivery",
  },
  {
    title: "Phường/Xã",
    dataIndex: "provinceDelivery",
  },
  {
    title: "Địa chỉ chi tiết",
    dataIndex: "locationDetailDelivery",
  },
  {
    title: "Tổng giá trị",
    dataIndex: "totalValue",
    render: (text) => <p>{formatMoney(text)}</p>,
  },
];

function ModalOrder({ isOpen, onClose, data, rowSelection, handleAddOrder }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thông tin gói hàng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="orderId"
          />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Đóng
          </Button>
          <Button colorScheme="blue" onClick={handleAddOrder}>
            Thêm gói hàng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default ModalOrder;
