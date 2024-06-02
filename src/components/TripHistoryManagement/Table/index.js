import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { Table, Tag } from "antd";
import { formatDate } from "../../../helpers";

function TableComponent() {
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;
  const [data, setData] = useState([]);

  const handleFetchData = async () => {
    try {
      const GetHistoryData = await axios.get("/Trips", { headers });
      if (GetHistoryData.status === 200) {
        const historyData = GetHistoryData.data;
        setData(historyData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uniqueDescriptions = {};

  const columns = [
    {
      title: "Id",
      dataIndex: "tripId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.tripId - b?.tripId,
    },
    {
      title: "Biển số xe",
      dataIndex: "vehicle",
      key: "licensePlate",
      render: (vehicle) => <p>{vehicle?.licensePlate}</p>,
      filters: data
        ?.map((item) => ({
          text: item?.vehicle.licensePlate,
          value: item?.vehicle.licensePlate,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.vehicle.licensePlate?.includes(value),
    },

    {
      title: "Tên nhân viên kho",
      dataIndex: "stocker",
      key: "stockerName",
      render: (stocker) => <p>{stocker?.stockerName}</p>,
      filters: data
        ?.map((item) => ({
          text: item?.stocker.stockerName,
          value: item?.stocker.stockerName,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.stocker.stockerName?.includes(value),
    },
    {
      title: "Tạo ngày đi",
      dataIndex: "createTripDate",
      render: (createTripDate) => <p>{formatDate(createTripDate)}</p>,
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "shipmentDate",
      render: (shipmentDate) => <p>{formatDate(shipmentDate)}</p>,
    },
    {
      title: "Ngày nhận hàng",
      dataIndex: "deliveredDate",
      render: (deliveredDate) => <p>{formatDate(deliveredDate)}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Idle",
          value: 2,
        },
        {
          text: "Delivery",
          value: 3,
        },
        {
          text: "Complete",
          value: 4,
        },
        {
          text: "Deleted",
          value: 5,
        },
      ],
      onFilter: (value, record) => record.status === value,
      width: "15%",
      render: (status) => {
        let bgColor = "green";
        let key = status;
        let text =
          status === 2
            ? "Idle"
            : status === 3
            ? "Delivery"
            : status === 4
            ? "Complete"
            : "Deleted";
        return (
          <Tag color={bgColor} key={key}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: "Lấy hàng",
          value: 1,
        },
        {
          text: "Giao hàng",
          value: 2,
        },
      ],
      onFilter: (value, record) => record.type === value,
      width: "15%",
      render: (type) => {
        let bgColor = "volcano";
        let key = type;
        let text = type === 1 ? "Lấy hàng" : "Giao hàng";
        return (
          <Tag color={bgColor} key={key}>
            {text}
          </Tag>
        );
      },
    },
  ];

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <>
      <Table dataSource={data} columns={columns} pageSize="6" />
    </>
  );
}

export default TableComponent;
