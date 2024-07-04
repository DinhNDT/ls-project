import { Box, Flex, Text } from "@chakra-ui/react";
import { Card, Space, Table } from "antd";
import React, { useMemo } from "react";

import { formatMoney } from "../../../helpers";
import { nanoid } from "nanoid";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";
import { FormOrderProduct } from "./FormOrderProduct";
import { FormAction } from "./FormAction";

export const OrderProduct = ({
  id,
  itemData,
  orderBill,
  onNextToReviewOrder,
  setItemSelected,
  setSelectedIndex,
  handleSubmit,
  onOpen,
  order,
  setOrder,
  setItemData,
  handleItemChange,
  handleItemChangeNumber,
}) => {
  const data = useMemo(
    () =>
      order.items.map(({ ...rest }, index) => {
        return { ...rest, key: index.toString() };
      }),
    [order]
  );

  const columns = [
    {
      title: "",
      dataIndex: "key",
      rowScope: "row",
      align: "center",
      width: 50,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "itemName",
      key: "itemName",
      width: 150,
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
      title: "Giá (vnđ)",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: "15%",
      render: (text) => <span>{formatMoney(Math.ceil(text))}</span>,
    },
    {
      title: "Action",
      width: "15%",
      align: "center",
      render: (_, record, i) => (
        <Space size="middle">
          <button
            onClick={() => {
              setItemSelected(record);
              setSelectedIndex(i);
              onOpen();
            }}
          >
            <AiFillEdit />
          </button>
          <button
            onClick={() => {
              let orderItems = [...order?.items];
              orderItems.splice(i, 1);
              setOrder({ ...order, items: orderItems });
            }}
          >
            <AiFillDelete />
          </button>
        </Space>
      ),
    },
    Table.EXPAND_COLUMN,
  ];

  const expandedRowRender = (record) => {
    const { unitWeight, quantityItem, color, description } = record;

    const data = [{ unitWeight, quantityItem, color, description }];

    const columnsTableMore = [
      {
        title: "Khối lượng(kg)",
        dataIndex: "unitWeight",
        key: "unitWeight",
        align: "center",
        width: 150,
      },
      {
        title: "Số lượng",
        dataIndex: "quantityItem",
        width: 100,
        key: "quantityItem",
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
    ];

    return (
      <Table
        rowKey={() => nanoid()}
        size="small"
        dataSource={data}
        columns={columnsTableMore}
        pagination={false}
      />
    );
  };

  const customExpandIcon = (props) => {
    if (props.expanded) {
      return (
        <Flex
          cursor="pointer"
          justifyContent="center"
          onClick={(e) => {
            props.onExpand(props.record, e);
          }}
        >
          <AiFillEyeInvisible />
        </Flex>
      );
    } else {
      return (
        <Flex
          cursor="pointer"
          justifyContent="center"
          onClick={(e) => {
            props.onExpand(props.record, e);
          }}
        >
          <AiFillEye />
        </Flex>
      );
    }
  };

  return (
    <Card style={{ marginTop: 15 }} type="inner" title="Thông tin mặt hàng">
      <Flex gap={10}>
        <Box width={"40%"}>
          <FormOrderProduct
            id={id}
            itemData={itemData}
            order={order}
            setOrder={setOrder}
            setItemData={setItemData}
            handleItemChange={handleItemChange}
            handleItemChangeNumber={handleItemChangeNumber}
          />
        </Box>
        <Box
          width={"60%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <Table
            title={() => <Text fontSize={14}>Mặt hàng đã thêm</Text>}
            dataSource={data}
            size="small"
            columns={columns}
            expandable={{
              expandedRowRender,
              expandIcon: (props) => customExpandIcon(props),
              defaultExpandedRowKeys: ["0"],
            }}
          />
          <FormAction
            handleSubmit={handleSubmit}
            order={order}
            orderBill={orderBill}
            onNextToReviewOrder={onNextToReviewOrder}
          />
        </Box>
      </Flex>
    </Card>
  );
};
