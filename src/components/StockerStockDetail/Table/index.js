import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../helpers";
import { Tag, Table } from "antd/es";

function TableComponent() {
  const userContext = useContext(GlobalContext);
  const location = useLocation();
  const { headers } = userContext;
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);

  const uniqueDescriptions = {};

  const columns = [
    {
      title: "Id",
      dataIndex: "stockDetailId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.stockDetailId - b?.stockDetailId,
    },
    {
      title: "Vị trí",
      dataIndex: "locationStock",
      render: (locationStock) => <p>{locationStock}</p>,
      filters: data
        ?.map((item) => ({
          text: item?.locationStock,
          value: item?.locationStock,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.locationStock?.includes(value),
    },

    {
      title: "Ngày nhập",
      dataIndex: "importDate",
      render: (importDate) => <p>{formatDate(importDate, false)}</p>,
    },
    {
      title: "Ngày xuất",
      dataIndex: "exportDate",
      render: (exportDate) => <p>{formatDate(exportDate)}</p>,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "item",
      key: "itemId",
      align: "center",
      render: (item) => <p>{item?.itemId}</p>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "item",
      key: "itemName",
      render: (item) => <p>{item?.itemName}</p>,
      filters: data
        ?.map((item) => ({
          text: item?.item?.itemName,
          value: item?.item?.itemName,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.item?.itemName?.includes(value),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity) => <p>{quantity}</p>,
    },
    {
      title: "Tên kho",
      dataIndex: "stock",
      render: (stock) => <p>{stock?.stockName}</p>,
      filters: data
        ?.map((item) => ({
          text: item?.stock?.stockName,
          value: item?.stock?.stockName,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.stock?.stockName?.includes(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Trong kho",
          value: true,
        },
        {
          text: "Hết hàng",
          value: false,
        },
      ],
      onFilter: (value, record) => record.status === value,
      width: "15%",
      render: (status) => {
        let bgColor = status ? "green" : "volcano";
        let key = status;
        let text = status ? "Trong kho" : "Hết hàng";
        return (
          <Tag color={bgColor} key={key}>
            {text}
          </Tag>
        );
      },
    },
  ];

  const handleFetchData = async () => {
    let url = "/Stock/StockDetail?status=true";
    try {
      const getListPrice = await axios.get(url, { headers });
      if (getListPrice.status === 200) {
        const listPriceData = getListPrice.data;
        setData(listPriceData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (headers) handleFetchData();
  }, [headers, location.pathname]);

  useEffect(() => {
    if (reload) {
      handleFetchData();
      setReload(false);
    }
  }, [reload]);
  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        pageSize="6"
        rowKey="stockDetailId"
      />
    </>
  );
}

export default TableComponent;
