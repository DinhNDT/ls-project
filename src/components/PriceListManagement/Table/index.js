import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";
import FormUpdate from "../FormUpdate";
import { IoMdAdd } from "react-icons/io";
import FormAdd from "../FormAdd";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { formatDate, formatMoney } from "../../../helpers";
import { default as FormViewDistance } from "../../DistanceListManagement/FormUpdate";
import { default as FormViewWeight } from "../../WeightListManagement/FormUpdate";
import { default as FormViewStaff } from "../../StaffManagement/FormUpdate";
import { Space, Table, Button as ButtonAntd } from "antd";
import { AiFillEdit, AiFillEye } from "react-icons/ai";

function TableComponent() {
  const userContext = useContext(GlobalContext);
  const toast = useToast({ position: "top" });

  const { userInformation, headers } = userContext;
  const defaultPrices = {
    listPriceId: "",
    distanceModeId: "",
    weightModeId: "",
    price: "",
    insurance: "",
    accountId: userInformation?.accounId,
  };

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [prices, setPrices] = useState(defaultPrices);
  const [openModal, setOpenModal] = useState(false);
  const [viewType, setViewType] = useState("");

  const handleUpdateModal = (item) => {
    setPrices(item);
    setOpenModalUpdate(true);
  };

  const handleOpenModal = (item) => {
    setPrices(item);
    setOpenModal(true);
  };

  const handleFetchData = async () => {
    try {
      const getListPrice = await axios.get("/ListPrices", { headers });
      if (getListPrice.status === 200) {
        const listPriceData = getListPrice.data;
        setData(listPriceData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const updatePrice = await axios.put(
        `/ListPrices/api/UpdateListPrice?listPriceId=${prices?.listPriceId}`,
        prices,
        { headers }
      );

      if (updatePrice.status === 200) {
        toast({
          title: "Cập nhật thành công !",
          status: "success",
          isClosable: true,
        });
        setReload(true);
        setOpenModalUpdate(false);
        setPrices(defaultPrices);
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống !",
        status: "error",
        description: `${err.message}`,
        isClosable: true,
      });
    }
  };
  const handleCreatePrice = async () => {
    try {
      const updatePrice = await axios.post(
        `/ListPrices/api/CreateListPrice`,
        { ...prices, accountId: userInformation?.accounId },
        { headers }
      );

      if (updatePrice.status === 200) {
        toast({
          title: "Tạo thành công !",
          status: "success",
          isClosable: true,
        });
        setReload(true);
        setOpenModalAdd(false);
        setPrices(defaultPrices);
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống !",
        status: "error",
        description: `${err.message}`,
        isClosable: true,
      });
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

  let ModalView = (
    <Modal
      isOpen={openModal}
      onClose={() => {
        setOpenModal(false);
        setPrices(defaultPrices);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewType}Thông tin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {viewType === "Distance" ? (
            <FormViewDistance distance={prices?.distanceMode} readOnly={true} />
          ) : viewType === "Weight" ? (
            <FormViewWeight distance={prices?.weightMode} readOnly={true} />
          ) : viewType === "Account" ? (
            <FormViewStaff account={prices?.account} readOnly={true} />
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setOpenModal(false);
              setPrices(defaultPrices);
            }}
          >
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  let ModalUpdate = (
    <Modal
      isOpen={openModalUpdate}
      onClose={() => {
        setOpenModalUpdate(false);
        setPrices(defaultPrices);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật giá</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormUpdate
            data={prices}
            openModalUpdate={openModalUpdate}
            prices={prices}
            setPrices={setPrices}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setOpenModalUpdate(false);
              setPrices(defaultPrices);
            }}
          >
            Đóng
          </Button>
          <Button variant="ghost" onClick={handleUpdatePrice}>
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  let ModalAdd = (
    <Modal isOpen={openModalAdd} onClose={() => setOpenModalAdd(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo giá mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormAdd
            openModalAdd={openModalAdd}
            prices={prices}
            setPrices={setPrices}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            variant="ghost"
            mr={3}
            onClick={() => setOpenModalAdd(false)}
          >
            Đóng
          </Button>
          <Button colorScheme="blue" onClick={handleCreatePrice}>
            Tạo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const uniqueDescriptions = {};

  const columns = [
    {
      title: "Id",
      dataIndex: "listPriceId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.listPriceId - b?.listPriceId,
    },
    {
      title: "Mô tả về khoảng cách",
      dataIndex: "distanceMode",
      filters: data
        ?.map((item) => ({
          text: item?.distanceMode?.description,
          value: item?.distanceMode?.description,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) =>
        record?.distanceMode?.description.includes(value),
      width: "15%",
      render: (_, record) => (
        <a
          onClick={() => {
            setViewType("Distance");
            handleOpenModal(record);
          }}
          style={{ display: "flex", alignItems: "center" }}
        >
          {record?.distanceMode?.description}{" "}
          <AiFillEye style={{ marginLeft: "5px" }} />
        </a>
      ),
    },
    {
      title: "Trọng lượng tối đa",
      dataIndex: "weightMode",
      filters: data
        ?.map((item) => ({
          text: item?.weightMode?.maxWeight + " " + "kg",
          value: item?.weightMode?.maxWeight,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record?.weightMode?.maxWeight === value,
      width: "15%",
      render: (_, record) => (
        <a
          onClick={() => {
            setViewType("Weight");
            handleOpenModal(record);
          }}
          style={{ display: "flex", alignItems: "center" }}
        >
          {record?.weightMode?.maxWeight} kg
          <AiFillEye style={{ marginLeft: "5px" }} />
        </a>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      defaultSortOrder: "price",
      render: (price) => <p>{formatMoney(price)} đ</p>,
    },
    {
      title: "Bảo hiểm",
      dataIndex: "insurance",
      render: (insurance) => <p>{insurance} %</p>,
    },
    {
      title: "Tên tài khoản",
      dataIndex: "account",
      filters: data
        ?.map((item) => ({
          text: item?.account?.fullName + " " + "kg",
          value: item?.account?.fullName,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record?.account?.fullName.includes(value),
      width: "15%",
      render: (_, record) => (
        <a
          onClick={() => {
            setViewType("Account");
            handleOpenModal(record);
          }}
          style={{ display: "flex", alignItems: "center" }}
        >
          {record?.account?.fullName}{" "}
          <AiFillEye style={{ marginLeft: "5px" }} />
        </a>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      render: (createdDate) => <p>{formatDate(createdDate, false)}</p>,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updateDate",
      render: (updateDate) => <p>{formatDate(updateDate, false)}</p>,
    },
    {
      title: "Hoạt Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleUpdateModal(record);
            }}
          >
            <AiFillEdit />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Flex justifyContent={"space-between"} flexDirection={"row-reverse"}>
        <ButtonAntd
          style={{ marginBottom: "10px" }}
          type="primary"
          onClick={() => {
            setOpenModalAdd(true);
            setPrices(defaultPrices);
          }}
        >
          <IoMdAdd />
        </ButtonAntd>
      </Flex>
      <Table
        dataSource={data}
        columns={columns}
        pageSize="6"
        rowKey="listPriceId"
      />
      {ModalUpdate}
      {ModalAdd}
      {ModalView}
    </>
  );
}

export default TableComponent;
