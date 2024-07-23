import { Text } from "@chakra-ui/react";
import { Table } from "antd";
import React from "react";

export const TableItem = ({ data }) => {
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
      render: (text) => <span>{text * 100}</span>,
    },
    {
      title: "Rộng(cm)",
      dataIndex: "width",
      key: "width",
      width: "8%",
      align: "center",
      render: (text) => <span>{text * 100}</span>,
    },
    {
      title: "Cao(cm)",
      dataIndex: "height",
      key: "height",
      width: "8%",
      align: "center",
      render: (text) => <span>{text * 100}</span>,
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
    // {
    //   title: "Giá sản phẩm",
    //   dataIndex: "unitPrice",
    //   key: "unitPrice",
    // render: (text) => <span>{formatMoney(Math.ceil(text))} VNĐ</span>,
    //   width: "15%",
    //   align: "center",
    // },
  ];
  return (
    <>
      <Text mb={5} fontSize={"20px"}>
        Mặt hàng vận chuyển
      </Text>
      <Table rowKey="itemId" dataSource={data} columns={columns} />
    </>
  );
};
