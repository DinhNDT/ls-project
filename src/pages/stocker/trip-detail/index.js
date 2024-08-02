import { Text } from "@chakra-ui/react";
import { Image, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  fallBackImg,
  formatDate,
  formatMoney,
  getStatusTrip,
  getStatusTripColor,
} from "../../../helpers";

const TripDetailPage = (id) => {
  const [tripData, setTripData] = useState([]);
  const [dataItemOrder, setDataItemOrder] = useState([]);

  const getItemOrderTrip = async (idItem) => {
    const res = await axios.get(
      `OrderTrip/itemOrderTrip?orderTripId=${idItem}`
    );
    return res.data;
  };

  const handleGetItemOrderTrip = async (dataOrderTrip) => {
    const results = [];
    for (const idItem of dataOrderTrip) {
      const trip = await getItemOrderTrip(idItem.orderTripId);
      results.push(trip);
    }
    return results;
  };

  const handleFetchData = async () => {
    try {
      const orderTrip = await axios.get(`OrderTrip?tripId=${id?.tripId}`);
      if (orderTrip.status === 200) {
        setTripData(
          orderTrip.data.map((value, index) => ({
            ...value,
            key: index.toString(),
          }))
        );
        const results = await handleGetItemOrderTrip(orderTrip.data);
        setDataItemOrder(results);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const expandedRowRender = (record) => {
    const { orderTripId } = record;
    const data = dataItemOrder?.filter(
      (value) => value.itemOrderTripResponse[0].orderTripId === orderTripId
    );

    const columnsTableMore = [
      {
        title: "Mã sản phẩm",
        dataIndex: "itemId",
        key: "itemId",
        align: "center",
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "itemName",
        key: "itemName",
        render: (_, record) => <span>{record.item.itemName}</span>,
      },
      {
        title: "Khối lượng(kg)",
        dataIndex: "unitWeight",
        key: "unitWeight",
        align: "center",
        render: (_, record) => <span>{record.item.unitWeight}</span>,
      },
      {
        title: "Số lượng",
        dataIndex: "quantityItem",
        key: "quantityItem",
        align: "center",
        render: (_, record) => <span>{record.item.quantityItem}</span>,
      },
      {
        title: "Giá (vnđ)",
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: "15%",
        align: "center",
        render: (_, record) => (
          <span>{formatMoney(Math.ceil(record.item.unitPrice))}</span>
        ),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        width: 300,
        render: (_, record) => <span>{record.item.description}</span>,
      },
    ];

    return (
      <Table
        rowKey="itemId"
        size="small"
        dataSource={data[0].itemOrderTripResponse}
        columns={columnsTableMore}
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: "Mã gói hàng",
      dataIndex: "orderTripId",
      key: "orderTripId",
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createTripDate",
      key: "createTripDate",
      render: (_, record) => (
        <span>{formatDate(record.trip.createTripDate)}</span>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "shipmentDate",
      key: "shipmentDate",
      render: (_, record) => (
        <span>{formatDate(record.trip.shipmentDate)}</span>
      ),
    },
    {
      title: "Ngày hoàn thành",
      dataIndex: "deliveredDate",
      key: "deliveredDate",
      render: (_, record) => (
        <span>{formatDate(record.trip.deliveredDate)}</span>
      ),
    },
    {
      title: "Tổng trọng lượng",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (text) => <span>{text} kg</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag
          color={getStatusTripColor(record.trip.status)}
          key={record.trip.status}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          {getStatusTrip(record.trip.status)}
        </Tag>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "evidence",
      key: "evidence",
      align: "center",
      render: (url) => (
        <Image width={100} height={100} src={url} fallback={fallBackImg} />
      ),
    },
  ];

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <Table
      title={() => <Text fontSize={19}>Chi tiết gói hàng</Text>}
      dataSource={tripData}
      columns={columns}
      rowKey="orderTripId"
      expandable={{
        expandedRowRender,
        defaultExpandedRowKeys: ["0"],
      }}
    />
  );
};

export default TripDetailPage;
