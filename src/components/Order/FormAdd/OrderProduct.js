import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { Button, Card, Image, Space, Table, Upload } from "antd";
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
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

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
  const toast = useToast({ position: "top" });

  const data = useMemo(
    () =>
      order.items.map((value, index) => {
        return {
          ...value,
          key: index.toString(),
          width: parseFloat((value.width * 100).toFixed(2)),
          height: parseFloat((value.height * 100).toFixed(2)),
          length: parseFloat((value.length * 100).toFixed(2)),
        };
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
      title: "Hoạt Động",
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
              apiDeleteItem(record.itemId);
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

  const apiDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/Order/item?itemId=${itemId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const upLoadImage = async (file, options) => {
    try {
      const res = await axios.put(
        `/ordersEvidence/envidence?orderId=${id}`,
        { image: file },
        {
          headers: {
            "content-type":
              "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
          },
        }
      );
      if (res.status === 200) {
        toast({
          title: "Cập nhật hình ảnh thành công !",
          status: "success",
          isClosable: true,
        });
        options.onSuccess({ data: "test" }, options.file);
      }
    } catch (error) {
      toast({
        title: "Cập nhật hình ảnh thất bại !",
        status: "error",
        description: `${error.message}`,
        isClosable: true,
      });
    }
  };

  const props = {
    name: "file",
    customRequest(options) {
      const data = new FormData();
      data.append("file", options.file);
      upLoadImage(data.get("file"), options);
    },
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
          <Box>
            {id ? (
              !order?.image ? (
                <>
                  <Text mb={"10px"}>Hình ảnh mặt hàng</Text>
                  <Box height={"90px"} mb={"39px"}>
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>
                        Click để tải ảnh lên
                      </Button>
                    </Upload>
                  </Box>
                </>
              ) : (
                <>
                  <Text mb={"10px"}>Hình ảnh mặt hàng</Text>
                  <Box mb={"3px"}>
                    {/* <Upload {...props} listType={null}>
                  <Button icon={<UploadOutlined />}>Click để đổi ảnh khác</Button>
                </ Upload> */}
                  </Box>
                  <Image width={250} height={200} src={order?.image} />
                </>
              )
            ) : null}

            <FormAction
              handleSubmit={handleSubmit}
              order={order}
              orderBill={orderBill}
              onNextToReviewOrder={onNextToReviewOrder}
            />
          </Box>
        </Box>
      </Flex>
    </Card>
  );
};
