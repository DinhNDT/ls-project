import { Table } from "antd";
import React, { useMemo } from "react";
import { formatMoney } from "../../../helpers";
import { Box, FormLabel, Text } from "@chakra-ui/react";

export const TableOrder = ({ order }) => {
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
      title: "Khối lượng(kg)",
      dataIndex: "height",
      key: "height",
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
      title: "Giá sản phẩm",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => <span>{formatMoney(Math.ceil(text))} VNĐ</span>,
      width: "15%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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

  return (
    <Table
      pagination={false}
      columns={columns}
      dataSource={order?.items}
      style={{ marginTop: 10, marginBottom: 35 }}
      footer={() => (
        <Box display={"flex"} gap={5} alignItems={"center"}>
          <FormLabel textAlign={"left"} margin={"unset"} fontSize={"small"}>
            Tổng giá trị đơn hàng:
          </FormLabel>
          <Text
            textAlign={"left"}
            color={"#4096ff"}
            fontWeight={500}
            fontSize={"small"}
          >
            {formatMoney(Math.ceil(totalPriceAllItem))} VNĐ
          </Text>
        </Box>
      )}
      rowKey="itemId"
    />
  );
};
