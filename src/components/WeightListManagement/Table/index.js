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
import { Space, Table, Button as ButtonAntd } from "antd";
import { AiFillEdit } from "react-icons/ai";
import FormUpdate from "../FormUpdate";
import { IoMdAdd } from "react-icons/io";
import FormAdd from "../FormAdd";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { formatDate } from "../../../helpers";

function TableComponent() {
  const toast = useToast({ position: "top" });
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;
  const defaultPrices = {
    minWeight: 0,
    maxWeight: 0,
  };
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [distance, setDistance] = useState({});
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);

  const handleFetchData = async () => {
    try {
      const getListPrice = await axios.get("/WeightMode", { headers });
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
        `/WeightMode/api/UpdateDistanceMode?weightModeId=${distance?.weightModeId}`,
        {
          minWeight: Number(distance.minWeight),
          maxWeight: Number(distance.maxWeight),
        },
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
      const updatePrice = await axios.post(
        `/WeightMode/api/CreateWeightMode`,
        {
          minWeight: Number(distance.minWeight),
          maxWeight: Number(distance.maxWeight),
        },
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
        setDistance(defaultPrices);
      }
    } catch (err) {
      toast({
        title: "Lỗi hệ thống !",
        description: `${err.response.data}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const hanldeUpdateModal = (item) => {
    setDistance(item);
    setOpenModalUpdate(true);
  };

  let ModalUpdate = (
    <Modal isOpen={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật trọng lượng</ModalHeader>
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

  console.log("distance:", distance);

  let ModalAdd = (
    <Modal isOpen={openModalAdd} onClose={() => setOpenModalAdd(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm trọng lượng mới</ModalHeader>
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
  const uniqueDescriptions = {};

  const columns = [
    {
      title: "Id",
      dataIndex: "weightModeId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.weightModeId - b?.weightModeId,
    },

    {
      title: "Trọng lượng tối thiểu (kg)",
      dataIndex: "minWeight",
      filters: data
        ?.map((item) => ({
          text: item?.minWeight + " kg",
          value: item?.minWeight,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.minWeight === value,
    },
    {
      title: "Trọng lượng tối đa (kg)",
      dataIndex: "maxWeight",
      filters: data
        ?.map((item) => ({
          text: item?.maxWeight + " kg",
          value: item?.maxWeight,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.maxWeight === value,
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
              hanldeUpdateModal(record);
            }}
          >
            <AiFillEdit />
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (headers) handleFetchData();
  }, [headers]);

  useEffect(() => {
    if (reload) {
      handleFetchData();
      setReload(false);
    }
  }, [reload]);
  return (
    <>
      <Flex justifyContent={"space-between"} flexDirection={"row-reverse"}>
        <ButtonAntd
          style={{ marginBottom: "10px" }}
          type="primary"
          onClick={() => {
            setOpenModalAdd(true);
            setDistance(defaultPrices);
          }}
        >
          <IoMdAdd />
        </ButtonAntd>
      </Flex>
      <Table
        dataSource={data}
        columns={columns}
        pageSize="6"
        rowKey="weightModeId"
      />
      {ModalUpdate}
      {ModalAdd}
    </>
  );
}

export default TableComponent;
