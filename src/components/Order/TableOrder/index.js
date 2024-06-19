import { Table } from "antd";
import React from "react";
import { formatMoney } from "../../../helpers";

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
      width: "12%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantityItem",
      key: "quantityItem",
      width: "8%",
    },
    {
      title: "Dài(cm)",
      dataIndex: "length",
      key: "length",
      width: "8%",
    },
    {
      title: "Rộng(cm)",
      dataIndex: "width",
      key: "width",
      width: "8%",
    },
    {
      title: "Cao(cm)",
      dataIndex: "height",
      key: "height",
      width: "8%",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => <span>{formatMoney(Math.ceil(text))} VNĐ</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "25%",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={order?.items}
      style={{ marginTop: 10 }}
      rowKey="itemId"
    />
  );
};
