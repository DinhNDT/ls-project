import { Button, Table, Tag } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  formatDate,
  formatMoney,
  getStatusColorPayment,
  getStatusTitlePayment,
} from "../../../helpers";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import dayjs from "dayjs";
import { OrderContext } from "../../../provider/order";

export const PaymentHistory = ({ idByRole, userRole }) => {
  const userContext = useContext(GlobalContext);
  const orderContext = useContext(OrderContext);
  const { headers, userInformation } = userContext;
  const { setKeySelected, setSelectedItem } = orderContext;
  const [dataPaymentHis, setDataPaymentHis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const uniqueDescriptions = {};

  const onClickOrderId = (orderId) => {
    setSelectedItem({ orderId });
    setKeySelected("0A");
  };

  const handleFetchData = async () => {
    const url =
      userRole === "Staff" ? "/Payments" : `/Payments?companyId=${idByRole}`;
    try {
      const paymentHistory = await axios.get(url, { headers });

      if (paymentHistory.status === 200) {
        setDataPaymentHis(paymentHistory.data);
        setIsLoading(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const columns = [
    {
      title: "Mã thanh toán",
      dataIndex: "paymentId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.orderId - b?.orderId,
      width: "150px",
    },
    {
      title: "Công ty",
      dataIndex: "companyName",
      key: "companyName",
      filters: dataPaymentHis
        ?.map((item) => ({
          text: item?.companyName,
          value: item?.companyName,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.companyName?.includes(value),
      hidden: userInformation?.role === "Company",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (text) => <span>{formatMoney(Math.ceil(text))} VNĐ</span>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (paymentDate) => <p>{formatDate(paymentDate)}</p>,
      sorter: (a, b) => dayjs(a.paymentDate) - dayjs(b.paymentDate),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => (
        <Button onClick={() => onClickOrderId(orderId)} type="link">
          {orderId}
        </Button>
      ),
      align: "center",
      width: "15%",
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColorPayment(status)}>
          {getStatusTitlePayment(status)}
        </Tag>
      ),
      filters: [
        {
          text: "Đã thanh toán",
          value: 1,
        },
        {
          text: "Thanh toán thất bại",
          value: 2,
        },
      ],
      onFilter: (value, record) => record.status === value,
      align: "center",
      width: "20%",
    },
  ];

  return (
    <Table
      loading={!isLoading}
      rowKey="paymentId"
      columns={columns}
      dataSource={dataPaymentHis}
    />
  );
};
