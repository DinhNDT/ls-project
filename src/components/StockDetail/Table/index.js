import { Tag, Table } from "antd";
import { formatDate } from "../../../helpers";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";

function TableComponent({ id }) {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;

  const handleFetchData = async () => {
    try {
      const getListPrice = await axios.get(`/Stock/StockDetail?stockId=${id}`, {
        headers,
      });
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
  }, [headers]);

  useEffect(() => {
    if (reload) {
      handleFetchData();
      setReload(false);
    }
  }, [reload]);

  const columns = [
    {
      title: "Id",
      dataIndex: "stockDetailId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.stockDetailId - b?.stockDetailId,
    },
    {
      title: "Địa chỉ",
      dataIndex: "locationStock",
      filters: data?.map((item) => ({
        text: item?.locationStock,
        value: item?.locationStock,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.locationStock.includes(value),
      width: "15%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity) => <p>{quantity}</p>,
    },
    {
      title: "Ngày nhập kho",
      dataIndex: "importDate",
      render: (importDate) => <p>{formatDate(importDate)}</p>,
    },
    {
      title: "Ngày xuất kho",
      dataIndex: "exportDate",
      render: (exportDate) => <p>{formatDate(exportDate)}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Trong kho", value: true },
        { text: "Hết hàng", value: false },
      ],
      onFilter: (value, record) => record.status === value,
      width: "15%",
      render: (status) => {
        let bgColor = status === true ? "green" : "volcano";
        let key = status;
        let title = status === true ? "Trong kho" : "Hết hàng";
        return (
          <Tag color={bgColor} key={key}>
            {title}
          </Tag>
        );
      },
    },
    {
      title: "Mặt hàng",
      dataIndex: "item",
      filters: data?.map((item) => ({
        text: item?.item?.itemName,
        value: item?.item?.itemName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.item?.itemName.includes(value),
      width: "25%",
      render: (item) => <p>{item?.itemName + " - " + item?.itemId}</p>,
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        pageSize="6"
        rowKey="weightModeId"
      />
    </>
  );
}

export default TableComponent;
