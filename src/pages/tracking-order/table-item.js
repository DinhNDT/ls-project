import { Text } from "@chakra-ui/react";
import { Table, Grid } from "antd";
import React from "react";
const { useBreakpoint } = Grid;

export const TableItem = ({ data }) => {
  const scr = useBreakpoint();

  const isMatchScr = scr.lg;

  const genNumber = (value) => parseFloat((value * 100).toFixed(2));

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
      render: (text, record) => (
        <div>
          {text}
          {!isMatchScr &&
            ` - (${genNumber(record.length)}x${genNumber(
              record.width
            )}x${genNumber(record.height)}), màu ${record.color}, nặng ${
              record.unitWeight
            }kg`}
        </div>
      ),
    },
    {
      title: "Dài(cm)",
      dataIndex: "length",
      key: "length",
      width: "8%",
      align: "center",
      render: (text) => <span>{parseFloat((text * 100).toFixed(2))}</span>,
      responsive: ["lg"],
    },
    {
      title: "Rộng(cm)",
      dataIndex: "width",
      key: "width",
      width: "8%",
      align: "center",
      render: (text) => <span>{parseFloat((text * 100).toFixed(2))}</span>,
      responsive: ["lg"],
    },
    {
      title: "Cao(cm)",
      dataIndex: "height",
      key: "height",
      width: "8%",
      align: "center",
      render: (text) => <span>{parseFloat((text * 100).toFixed(2))}</span>,
      responsive: ["lg"],
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
      responsive: ["lg"],
    },
    {
      title: "Khối lượng(kg)",
      dataIndex: "unitWeight",
      key: "unitWeight",
      width: "130px",
      align: "center",
      responsive: ["lg"],
    },
    {
      title: "Số lượng",
      dataIndex: "quantityItem",
      key: "quantityItem",
      width: "8%",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      responsive: ["lg"],
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
      <Table
        rowKey="itemId"
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </>
  );
};
