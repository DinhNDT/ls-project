import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { Table, Tag } from "antd";
import {
  formatDate,
  getStatusTrip,
  getStatusTripColor,
} from "../../../helpers";
import { AiFillEye } from "react-icons/ai";
import { OrderContext } from "../../../provider/order";

function TableComponent() {
  const userContext = useContext(GlobalContext);
  const orderContext = useContext(OrderContext);
  const { setKeySelected, setSelectedItem } = orderContext;
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
      title: "Mã chuyến xe",
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
      title: "Ngày tạo chuyến",
      dataIndex: "createTripDate",
      render: (createTripDate) => <p>{formatDate(createTripDate)}</p>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "shipmentDate",
      render: (shipmentDate) => <p>{formatDate(shipmentDate)}</p>,
    },
    {
      title: "Ngày hoàn thành",
      dataIndex: "deliveredDate",
      render: (deliveredDate) => <p>{formatDate(deliveredDate)}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Hàng Đã Về Kho",
          value: 2,
        },
        {
          text: "Đang Giao Hàng",
          value: 3,
        },
        {
          text: "Đang Lấy Hàng",
          value: 6,
        },
        {
          text: "Hoàn Thành",
          value: 4,
        },
        {
          text: "Đã Xóa",
          value: 5,
        },
      ],
      onFilter: (value, record) => record.status === (value === 6 ? 2 : value),
      width: "15%",
      render: (status, record) => {
        return (
          <Tag
            color={getStatusTripColor(status)}
            key={status}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            {(record.type === 2 && status === 3 && "Đang Giao Hàng") ||
              (record.type === 1 && status === 2 && "Đang Lấy Hàng") ||
              getStatusTrip(status)}
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
      width: "10%",
      render: (type) => {
        let bgColor = type === 1 ? "cyan" : "gold";
        let key = type;
        let text = type === 1 ? "Lấy hàng" : "Giao hàng";
        return (
          <Tag color={bgColor} key={key}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Hoạt Động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <button
          onClick={() => {
            // setSelectedItem(record);
            // if (isRoleStocker) {
            setKeySelected("3A");
            setSelectedItem({ tripId: record.tripId });
            //   setUrlTrip(keySelected);
            // } else {
            //   setKeySelected("0A");
            // }
          }}
        >
          <AiFillEye />
        </button>
      ),
    },
  ];

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <>
      <Table dataSource={data} columns={columns} pageSize="6" rowKey="tripId" />
    </>
  );
}

export default TableComponent;
