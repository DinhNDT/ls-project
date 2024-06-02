import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button as ButtonChakra,
  Flex,
} from "@chakra-ui/react";

import FormUpdate from "../FormUpdate";
import { TbDatabaseExport } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { exportToExcel, formatDate, getStatusTrip } from "../../../helpers";
import { Tag, Table, Button } from "antd/es";

function TableComponent({ url }) {
  const userContext = useContext(GlobalContext);
  const { headers, userInformation } = userContext;
  const defaultPrices = {
    locationInStock: "",
  };

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [locationInStock, setLocationInStock] = useState();
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [selectedRows, setSelectedRows] = useState();
  const [dataExport, setDataExport] = useState([
    ["Id", "Chủ kho", "Số lượng", "Ngày lấy hàng", "Trạng thái"],
  ]);

  const handleFetchData = async () => {
    let urlQ = url.includes("stock-import")
      ? "/Trips?type=1&status=3"
      : "/Trips?type=2&status=2";

    let imExUrl = url.includes("stock-import")
      ? "/TransactionItem/api/CreateTransactionItem?type=Nh%E1%BA%ADp%20Kho"
      : "/TransactionItem/api/CreateTransactionItem?type=Xu%E1%BA%A5t%20Kho";
    try {
      const [getListPrice, getImportOrExport] = await Promise.all([
        axios.get(urlQ, {
          headers,
        }),
        axios.get(imExUrl, { headers }),
      ]);
      if (getListPrice.status === 200) {
        const listPriceData = getListPrice.data;
        setData(listPriceData);
      }
      if (getImportOrExport.status === 200) {
        const exportData = getImportOrExport?.data.map((item, _) => {
          const { transactionItemId, quantity, date, success, stocker } = item;
          return [
            transactionItemId,
            stocker?.stockerName,
            quantity,
            formatDate(date),
            success ? "Thành công" : "Thất bại",
          ];
        });
        setDataExport([
          ["Id", "Chủ kho", "Số lượng", "Ngày lấy hàng", "Trạng thái"],
          ...exportData,
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdatePrice = async () => {
    let urlZ = url.includes("stock-import")
      ? `/TransactionItem?tripId=${selectedRows}&stockerId=${userInformation?.accounId}`
      : `/TransactionItem/api/CreateTransactionExitItem?tripId=${selectedRows}&stockerId=${userInformation?.accounId}`;
    try {
      const updatePrice = await axios.post(urlZ, locationInStock, { headers });

      if (updatePrice.status === 200) {
        alert("Cập nhật thành công");
        setReload(true);
        setOpenModalUpdate(false);
        setSelectedRows(null);
        setLocationInStock(defaultPrices);
      }
    } catch (err) {
      alert(err);
    }
  };

  const hanldeUpdateModal = () => {
    setOpenModalUpdate(true);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, _) => {
      setSelectedRows(selectedRowKeys[0]);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  let ModalUpdate = (
    <Modal isOpen={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {url.includes("/stock-export") ? "Xuất kho" : "Nhập kho"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormUpdate
            locationInStock={locationInStock}
            setLocationInStock={setLocationInStock}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => setOpenModalUpdate(false)}
          >
            Đóng
          </Button>
          <Box w="10px"></Box>
          <Button type="primary" onClick={handleUpdatePrice}>
            {url.includes("/stock-export") ? "Xuất" : "Nhập"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const uniqueDescriptions = {};

  const columns = [
    {
      title: "Id",
      dataIndex: "tripId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.tripId - b?.tripId,
    },
    {
      title: "Xe",
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
      title: "Người tạo",
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
          text: "Deleted",
          value: 1,
        },
        {
          text: "Idle",
          value: 2,
        },
        {
          text: "Delivering",
          value: 3,
        },
        {
          text: "Completed",
          value: 4,
        },
        {
          text: "Problem",
          value: 5,
        },
        {
          text: "Getting",
          value: 6,
        },
      ],
      onFilter: (value, record) => record.status === value,
      width: "15%",
      render: (status) => {
        let bgColor = status ? "green" : "volcano";
        let key = status;
        let text = getStatusTrip(status);
        return (
          <Tag color={bgColor} key={key}>
            {text}
          </Tag>
        );
      },
    },
  ];

  useEffect(() => {
    if (headers) handleFetchData();
  }, [headers, url]);

  useEffect(() => {
    if (reload) {
      handleFetchData();
      setReload(false);
    }
  }, [reload]);
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
        onClick={() => exportToExcel(dataExport, "Nhập kho")}
      >
        <TbDatabaseExport style={{ fontSize: "24px" }} />
      </ButtonChakra>
      <Flex flexDirection={"row-reverse"} mb="1%">
        {selectedRows && (
          <Button
            type="primary"
            onClick={() => {
              if (url.includes("stock-import")) {
                setOpenModalUpdate(true);
              } else {
                handleUpdatePrice();
              }
            }}
          >
            {url.includes("/stock-export") ? "Xuất kho" : "Nhập kho"}
          </Button>
        )}
      </Flex>
      <Table
        dataSource={data}
        columns={columns}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        rowKey="tripId"
        pageSize="6"
      />
      {ModalUpdate}
    </>
  );
}

export default TableComponent;
