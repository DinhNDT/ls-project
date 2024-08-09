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
import { Table, Button as ButtonAntd, Space } from "antd";
import { AiFillEdit, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { OrderContext } from "../../../provider/order";

function TableComponent() {
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;
  const toast = useToast({ position: "top" });

  const orderContext = useContext(OrderContext);
  const { setKeySelected, setSelectedItem } = orderContext;

  const defaultPrices = {
    location: "",
    stockName: "",
    totalItem: 0,
  };
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [distance, setDistance] = useState({});

  const hanldeUpdateModal = (item) => {
    console.log("item", item);

    setDistance(item);
    setOpenModalUpdate(true);
  };

  const handleFetchData = async () => {
    try {
      const getListPrice = await axios.get("/Stock", { headers });
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
        `/Stock/api/UpdateStock?stockId=${distance?.stockId}`,
        distance,
        { headers }
      );

      if (updatePrice.status === 200) {
        toast({
          title: "Cập nhật thành công",
          status: "success",
          isClosable: true,
        });
        setReload(true);
        setOpenModalUpdate(false);
        setDistance(defaultPrices);
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống !",
        description: `${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreatePrice = async () => {
    try {
      const updatePrice = await axios.post(`/Stock/api/CreateStock`, distance, {
        headers,
      });

      if (updatePrice.status === 200) {
        toast({
          title: "Tạo thành công",
          status: "success",
          isClosable: true,
        });
        setReload(true);
        setOpenModalAdd(false);
        setDistance(defaultPrices);
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống !",
        description: `${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      const updatePrice = await axios.delete(`/Stock/${id}`, distance, {
        headers,
      });

      if (updatePrice.status === 200) {
        toast({
          title: "Xóa kho thành công !",
          status: "success",
          isClosable: true,
        });
        setReload(true);
        setOpenModalAdd(false);
        setDistance(defaultPrices);
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống!.",
        description: `${err.message}`,
        status: "error",
        duration: 3000,
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

  let ModalUpdate = (
    <Modal isOpen={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật kho</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormUpdate distance={distance} setDistance={setDistance} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => setOpenModalUpdate(false)}
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
        <ModalHeader>Tạo mới kho</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormAdd distance={distance} setDistance={setDistance} />
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

  const columns = [
    {
      title: "Id",
      dataIndex: "stockId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.stockId - b?.stockId,
    },
    {
      title: "Tên kho",
      dataIndex: "stockName",
      defaultSortOrder: "stockName",
      filters: data?.map((item) => ({
        text: item?.stockName,
        value: item?.stockName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.stockName.includes(value),
      width: "25%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "location",
      defaultSortOrder: "location",
      filters: data?.map((item) => ({
        text: item?.location,
        value: item?.location,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.location.includes(value),
      width: "25%",
    },
    {
      title: "Tổng sản phẩm",
      dataIndex: "totalItem",
      defaultSortOrder: "totalItem",
    },
    {
      title: "Hoạt Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              hanldeUpdateModal(record);
            }}
          >
            <AiFillEdit />
          </button>
          <button
            onClick={() => {
              handleDeleteStock(record?.stockId);
            }}
          >
            <AiOutlineDelete />
          </button>
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
          }}
        >
          <IoMdAdd />
        </ButtonAntd>
      </Flex>
      <Table
        dataSource={data}
        columns={columns}
        pageSize="6"
        rowKey="stockId"
      />
      {ModalUpdate}
      {ModalAdd}
    </>
  );
}

export default TableComponent;
