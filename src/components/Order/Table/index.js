import { IconButton, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import ModalOrder from "../ModalOrder";
import GoongMapWithRoute from "../../Map";
import {
  exportToExcel,
  formatDate,
  getStatusColor,
  getStatusColorPayment,
  getStatusTitle,
  getStatusTitlePayment,
} from "../../../helpers";
import { TbDatabaseExport, TbReload } from "react-icons/tb";
import { Space, Table, Tag, Button } from "antd";
import {
  AiFillEdit,
  AiFillEye,
  AiOutlineArrowUp,
  AiOutlineCalendar,
  AiOutlineCheck,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineShop,
} from "react-icons/ai";

import { IoReload } from "react-icons/io5";

import { OrderContext } from "../../../provider/order";
import { Button as ButtonChakra } from "@chakra-ui/react";
import { Flex } from "antd/es";
import dayjs from "dayjs";

export const getStatusIcon = (status) => {
  const statusTitles = {
    1: "",
    2: <AiOutlineArrowUp />,
    3: <AiOutlineCheck />,
    4: <AiOutlineCloseCircle />,
    5: <AiOutlineClockCircle />,
    6: <AiOutlineCheck />,
    7: <AiOutlineCalendar />,
    9: <AiOutlineShop />,
  };

  return statusTitles[status] || "";
};

function TableComponent({ url = "" }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const userContext = useContext(GlobalContext);
  const { userInformation, headers } = userContext;
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const orderContext = useContext(OrderContext);
  const { setKeySelected, setSelectedItem, setState, setUrlTrip, keySelected } =
    orderContext;
  const [order, setOrder] = useState([]);
  const [temporarySelectedIds, setTemporarySelectedIds] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const [openMap, setOpenMap] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [dataExport, setDataExport] = useState([
    [
      "Id",
      "Công ty",
      "Người nhận",
      "Ngày đặt hàng",
      "Ngày lấy hàng",
      "Trạng thái",
    ],
  ]);

  const isRoleStocker = userInformation?.role === "Stocker";

  const uniqueDescriptions = {};

  const columns = [
    {
      title: "Id",
      dataIndex: "orderId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.orderId - b?.orderId,
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "companyName",
      render: (company) => <p>{company?.companyName}</p>,
      filters: data
        ?.map((item) => ({
          text: item?.company?.companyName,
          value: item?.company?.companyName,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.company?.companyName?.includes(value),
      width: "15%",
      hidden: userInformation?.role === "Company",
    },

    {
      title: "Người nhận",
      dataIndex: "deliveryTo",
      defaultSortOrder: "deliveryTo",
      filters: data
        ?.map((item) => ({
          text: item?.deliveryTo,
          value: item?.deliveryTo,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.deliveryTo?.includes(value),
      width: "15%",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      render: (orderDate) => <p>{formatDate(orderDate)}</p>,
      sorter: (a, b) => dayjs(a.orderDate) - dayjs(b.orderDate),
    },
    {
      title: "Ngày lấy hàng",
      dataIndex: "dayGet",
      render: (dayGet) => <p>{formatDate(dayGet)}</p>,
      sorter: (a, b) => dayjs(a.dayGet) - dayjs(b.dayGet),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: isRoleStocker
        ? null
        : [
            {
              text: "Hàng đã về kho",
              value: 1,
            },
            {
              text: "Đang đợi",
              value: 2,
            },
            {
              text: "Đã duyệt",
              value: 3,
            },
            {
              text: "Từ chối",
              value: 4,
            },
            {
              text: "Vận chuyển",
              value: 5,
            },
            {
              text: "Hoàn thành",
              value: 6,
            },
            {
              text: "Trì hoãn",
              value: 7,
            },
            {
              text: "Tồn kho",
              value: 9,
            },
          ],
      defaultFilteredValue: isRoleStocker ? null : ["2", "3"],
      onFilter: (value, record) => record.status === value,
      width: "15%",
      render: (status) => {
        return (
          <Tag
            icon={getStatusIcon(status)}
            color={getStatusColor(status)}
            key={status}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            {getStatusTitle(status)}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      render: (status) => (
        <Tag color={getStatusColorPayment(status)}>
          {getStatusTitlePayment(status)}
        </Tag>
      ),
      filters: isRoleStocker
        ? null
        : [
            {
              text: "Chưa thanh toán",
              value: 0,
            },
            {
              text: "Đã thanh toán",
              value: 1,
            },
            {
              text: "Thanh toán thất bại",
              value: 2,
            },
          ],
      onFilter: (value, record) => record.paymentStatus === value,
      width: 200,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {record.status === 2 && (
            <button
              onClick={() => {
                setSelectedItem(record);
                setKeySelected("0");
              }}
            >
              <AiFillEdit />
            </button>
          )}

          <button
            onClick={() => {
              setSelectedItem(record);
              if (isRoleStocker) {
                setKeySelected("0AS");
                setUrlTrip(keySelected);
              } else {
                setKeySelected("0A");
              }
            }}
          >
            <AiFillEye />
          </button>
        </Space>
      ),
    },
  ];

  const rowOrderIdSelection = {
    onChange: (selectedRowKeys, _) => {
      setSelectedRows(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  const handleFetchData = async () => {
    let urlQ = "/Order/order";
    if (isRoleStocker) {
      urlQ = url.includes("order-delivery")
        ? "/Order/orderDueToday"
        : "/Order/order?paymentStatus=1&status=3";
    }
    if (userInformation?.role === "Company") {
      urlQ = `/Order/ByCompanyId/${userInformation?.idByRole}`;
      url = `/Order/order?accountId=${userInformation?.accounId}`;
    }
    try {
      const getOrder = await axios.get(urlQ, { headers });
      if (getOrder.status === 200) {
        let companyData = getOrder.data;
        setData(companyData);

        setCoordinates(
          companyData.map((item) => {
            return {
              position: url.includes("order-delivery")
                ? [item?.longtitudeDelivery, item?.lattitudeDelivery]
                : [item?.longtitudeGet, item?.lattitudeGet],
              orderId: item?.orderId,
            };
          })
        );
        if (isRoleStocker) {
          let companyIdData = companyData?.map((item) => item?.orderId);
          const getOrderByProvince = await axios.post(
            "/Order/orderDueTodayByProvinceDelivery",
            companyIdData,
            { headers }
          );
          if (getOrderByProvince.status === 200) {
            const orderData = getOrderByProvince.data;
            setOrder(orderData);

            setTemporarySelectedIds(orderData);
          }
        }
        const exportData = companyData?.map((item, _) => {
          const { orderId, orderDate, dayGet, status, company, deliveryTo } =
            item;
          return [
            orderId,
            deliveryTo,
            company?.companyName,
            formatDate(orderDate),
            formatDate(dayGet),
            getStatusTitle(status),
          ];
        });
        setDataExport([
          [
            "Id",
            "Công ty",
            "Người nhận",
            "Ngày đặt hàng",
            "Ngày lấy hàng",
            "Trạng thái",
          ],
          ...exportData,
        ]);
        setIsLoading(true);
      } else {
        console.log("Can't get time share");
        setIsLoading(true);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(true);
    }
  };

  const onSelectChange = (_, selectedRows) => {
    setTemporarySelectedIds(selectedRows);
  };

  const handleAddOrder = async () => {
    try {
      let payload = temporarySelectedIds.flatMap((order) =>
        order.items.map((item) => item.itemId)
      );
      const getItemId = await axios.put(
        "/Trips/api/getItemToVehicle",
        payload,
        {
          headers,
        }
      );
      if (getItemId.status === 200) {
        let getItemToVehicle = getItemId.data;
        setState(getItemToVehicle);
        setUrlTrip(`/stocker/create-trip/delivery`);
        setKeySelected("8");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddDataHandMade = async () => {
    try {
      if (url.includes("stocker/order-get")) {
        setState({ orderId: selectedRows[0] });
        setUrlTrip(`/stocker/create-trip/get`);
        setKeySelected("8");
      } else {
        let payload = data
          ?.filter((item) => selectedRows.includes(item?.orderId))
          .flatMap((order) => order.items.map((item) => item.itemId));
        const getItemId = await axios.put(
          "/Trips/api/getItemToVehicle",
          payload,
          {
            headers,
          }
        );
        if (getItemId.status === 200) {
          let getItemToVehicle = getItemId.data;
          setState(getItemToVehicle);
          setUrlTrip(`/stocker/create-trip/delivery`);
          setKeySelected("8");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAdd = () => {
    if (isRoleStocker) {
      onOpen();
    } else {
      const url =
        userInformation?.role === "Staff"
          ? `/staff/create-order`
          : userInformation?.role === "Company"
          ? `/company/create-order`
          : "#";
      navigate(url);
      setKeySelected("2");
    }
  };

  const handleReload = () => {
    setReload(true);
  };

  useEffect(() => {
    if (headers?.Authorization) {
      handleFetchData();
    }
  }, [headers, url]);

  useEffect(() => {
    if (reload) handleFetchData();
    const clearTime = setTimeout(() => {
      setReload(false);
    }, 500);
    return () => {
      clearTimeout(clearTime);
    };
  }, [reload]);

  useEffect(() => {
    const newRowSelection = {
      onChange: onSelectChange,
      selectedRowKeys: temporarySelectedIds?.map((rowKey) => rowKey?.orderId),
      getCheckboxProps: (record) => ({
        name: record.name,
      }),
    };
    if (isOpen) {
      setRowSelection(newRowSelection);
    }
  }, [isOpen, temporarySelectedIds]);

  useEffect(() => {
    setSelectedRows([]);
  }, [url]);

  return (
    <>
      <ButtonChakra
        position="fixed"
        bottom={"50px"}
        right={"50px"}
        bgColor={"#0BC5EA"}
        zIndex={"100"}
        borderRadius={"50%"}
        w={"50px"}
        h={"50px"}
        onClick={() => exportToExcel(dataExport, "Đơn đặt hàng")}
      >
        <TbDatabaseExport style={{ fontSize: "24px" }} />
      </ButtonChakra>
      {isRoleStocker && (
        <GoongMapWithRoute
          isOpen={openMap}
          onClose={() => setOpenMap(false)}
          coordinates={coordinates}
        />
      )}
      <ModalOrder
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={order}
        rowSelection={rowSelection}
        handleAddOrder={handleAddOrder}
      />
      <Flex
        style={{ marginBottom: "1%", flexDirection: "row-reverse" }}
        gap={"10px"}
      >
        {isRoleStocker && url.includes("order-delivery") ? (
          <Button type="primary" onClick={handleAdd}>
            Tạo chuyến xe theo các tỉnh
          </Button>
        ) : isRoleStocker && url.includes("order-get") ? null : (
          <>
            <Button type="primary" onClick={handleAdd}>
              <IoMdAdd />
            </Button>
            <IconButton
              isLoading={reload}
              width="45.6px"
              height="32px"
              onClick={handleReload}
              colorScheme="gray"
              icon={<IoReload fontSize={"18px"} />}
            />
          </>
        )}

        {isRoleStocker && (
          <>
            {selectedRows.length ? (
              <Button type="primary" onClick={handleAddDataHandMade}>
                Tạo chuyến xe thủ công
              </Button>
            ) : null}
            <Button onClick={() => setOpenMap(true)}>
              {url.includes("order-delivery")
                ? "Vị trí giao hàng"
                : "Vị trí lấy hàng"}
            </Button>
          </>
        )}
      </Flex>
      <Table
        loading={reload || (data.length === 0 && !isLoading)}
        dataSource={data}
        columns={columns}
        rowSelection={{
          type: url.includes("order-delivery") ? "checkbox" : "radio",
          ...rowOrderIdSelection,
        }}
        pageSize="6"
        rowKey="orderId"
      />
    </>
  );
}

export default TableComponent;
