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
  const [itemSelected, setItemSelected] = useState({});
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [distance, setDistance] = useState({});

  useEffect(() => {
    setDistance({
      location: itemSelected?.location,
      stockName: itemSelected?.stockName,
      totalItem: itemSelected?.totalItem,
    });
  }, [itemSelected]);

  const hanldeUpdateModal = (item) => {
    setItemSelected(item);
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
        `/Stock/api/UpdateStock?stockId=${itemSelected?.stockId}`,
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
      alert(err.response.data);
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
      } else {
        alert(updatePrice.data);
      }
    } catch (err) {
      alert(err.response.data);
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      const updatePrice = await axios.delete(`/Stock/${id}`, distance, {
        headers,
      });

      if (updatePrice.status === 200) {
        alert("Xóa kho thành công");
        setReload(true);
        setOpenModalAdd(false);
        setDistance(defaultPrices);
      } else {
        alert(updatePrice.data);
      }
    } catch (err) {
      alert(err.response.data);
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
        <ModalHeader>Update Stock</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormUpdate data={itemSelected} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => setOpenModalUpdate(false)}
          >
            Close
          </Button>
          <Button variant="ghost" onClick={handleUpdatePrice}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  let ModalAdd = (
    <Modal isOpen={openModalAdd} onClose={() => setOpenModalAdd(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Stock</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormAdd />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            variant="ghost"
            mr={3}
            onClick={() => setOpenModalAdd(false)}
          >
            Close
          </Button>
          <Button colorScheme="blue" onClick={handleCreatePrice}>
            Create
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              hanldeUpdateModal(record);
            }}
          >
            <AiFillEdit />
          </a>
          <a
            onClick={() => {
              handleDeleteStock(record?.stockId);
            }}
          >
            <AiOutlineDelete />
          </a>
          <a
            onClick={() => {
              setKeySelected("0");
              setSelectedItem(record);
            }}
          >
            <AiOutlineEye />
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
          }}
        >
          <IoMdAdd />
        </ButtonAntd>
      </Flex>
      <Table
        dataSource={data}
        columns={columns}
        pageSize="6"
        rowKey="accountId"
      />
      {ModalUpdate}
      {ModalAdd}
    </>
  );
}

export default TableComponent;
