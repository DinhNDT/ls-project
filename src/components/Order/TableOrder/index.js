import { Modal, Table } from "antd";
import React, { useMemo, useState } from "react";
import { formatMoney } from "../../../helpers";
import { Box, Flex, FormLabel, Text } from "@chakra-ui/react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import PriceListOrderPage from "../../../pages/price-list-order";

const TableSummaryRow = ({
  title,
  content,
  description,
  isHighLight = false,
}) => {
  return (
    <Table.Summary.Row
      style={{ backgroundColor: isHighLight ? "#fafafa" : "" }}
    >
      <Table.Summary.Cell index={0} colSpan={7}>
        <FormLabel
          textAlign={"left"}
          margin={"unset"}
          fontSize={isHighLight ? "medium" : "small"}
        >
          {title}
        </FormLabel>
        {description && (
          <FormLabel
            textAlign={"left"}
            margin={"unset"}
            fontSize={"smaller"}
            color={"#B2B2B2"}
          >
            {description}
          </FormLabel>
        )}
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1} colSpan={3} align="center">
        {content}
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
};

export const TableOrder = ({ order, orderBill, id }) => {
  const orderTable = id ? order : orderBill;

  const [modal, setModal] = useState({ isOpen: false, type: 1 });

  const showModal = (type = 1) => {
    setModal({ isOpen: true, type });
  };

  const handleOk = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleCancel = () => {
    setModal({ ...modal, isOpen: false });
  };
  const columns = [
    {
      title: "",
      dataIndex: "key",
      rowScope: "row",
      align: "center",
      width: "35px",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "Dài(cm)",
      dataIndex: "length",
      key: "length",
      width: "8%",
      align: "center",
    },
    {
      title: "Rộng(cm)",
      dataIndex: "width",
      key: "width",
      width: "8%",
      align: "center",
    },
    {
      title: "Cao(cm)",
      dataIndex: "height",
      key: "height",
      width: "8%",
      align: "center",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Khối lượng(kg)",
      dataIndex: "unitWeight",
      key: "unitWeight",
      width: "130px",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantityItem",
      key: "quantityItem",
      width: "8%",
      align: "center",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => <span>{formatMoney(Math.ceil(text))} VNĐ</span>,
      width: "15%",
    },
  ];

  const totalPriceAllItem = useMemo(
    () =>
      order?.items?.reduce((total, current) => {
        return (total +=
          Number(current.unitPrice) * Number(current.quantityItem));
      }, 0),
    [order]
  );

  const totalItem = useMemo(
    () =>
      order?.items?.reduce((total, current) => {
        return (total += Number(current.quantityItem));
      }, 0),
    [order]
  );

  return (
    <>
      <Table
        bordered
        pagination={false}
        columns={columns}
        dataSource={order?.items}
        style={{ marginTop: 10, marginBottom: 35 }}
        summary={() => (
          <Table.Summary fixed>
            <TableSummaryRow
              title={"Khoảng cách vận chuyển:"}
              content={<>{orderTable?.distance} Km</>}
            />
            <TableSummaryRow
              title={"Tổng số lượng sản phẩm:"}
              content={totalItem}
            />
            <TableSummaryRow
              title={"Tổng giá trị đơn hàng:"}
              content={<>{formatMoney(Math.ceil(totalPriceAllItem))} VNĐ</>}
            />
            <TableSummaryRow
              title={"Giá bảo hiểm đơn hàng:"}
              description={"(2% giá trị đơn hàng)"}
              content={
                <>{formatMoney(Math.ceil(orderTable?.totalInsurance))} VNĐ</>
              }
            />
            <TableSummaryRow
              title={
                <Flex align={"center"} gap={1}>
                  Tổng khối lượng
                  <AiOutlineQuestionCircle
                    style={{ cursor: "pointer" }}
                    onClick={() => showModal(2)}
                  />{" "}
                  :
                </Flex>
              }
              content={<>{orderTable?.totalWeight} Kg</>}
            />
            <TableSummaryRow
              title={"Đơn giá:"}
              description={"(VNĐ/Kg)"}
              content={<>{formatMoney(Math.ceil(orderTable?.price))} VNĐ</>}
            />
            <TableSummaryRow
              title={
                <Flex align={"center"} gap={1}>
                  Cước Vận Chuyển
                  <AiOutlineQuestionCircle
                    fontSize={13}
                    style={{ cursor: "pointer" }}
                    onClick={() => showModal()}
                  />{" "}
                  :
                </Flex>
              }
              description={"(Tổng khối lượng x Đơn giá + Giá bảo hiểm)"}
              isHighLight
              content={
                <Text color={"#4096ff"} fontWeight={500} fontSize={"medium"}>
                  {formatMoney(Math.ceil(orderTable?.deliveryPrice))} VNĐ
                </Text>
              }
            />
          </Table.Summary>
        )}
        rowKey={(row) =>
          row.itemName + row.itemId + id + row.height + row.quantityItem
        }
      />
      <Modal
        title="Cước vận tải đường bộ (CPT)"
        centered
        open={modal.isOpen}
        width={modal.type === 1 ? 1000 : 800}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={handleOk}
      >
        {modal.type === 1 ? (
          <PriceListOrderPage size="small" />
        ) : (
          <Box>
            <Text fontSize={"medium"}>
              • Đối với bưu phẩm cồng kềnh, hoặc hàng nhẹ, áp dụng công thức
              tính trọng lượng khối quy đổi.
            </Text>
            <Text fontSize={"medium"}>
              • Trọng lượng quy đổi = (Dài x Rộng x Cao) (cm3) / 3000.
            </Text>
          </Box>
        )}
      </Modal>
    </>
  );
};
