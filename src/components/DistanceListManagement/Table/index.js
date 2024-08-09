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
import { formatDate } from "../../../helpers";

import { useContext, useEffect, useState } from "react";
import FormUpdate from "../FormUpdate";
import { IoMdAdd } from "react-icons/io";
import FormAdd from "../FormAdd";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { Space, Table, Button as ButtonAntd } from "antd";
import { AiFillEdit } from "react-icons/ai";

function TableComponent() {
  const toast = useToast({ position: "top" });
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;
  const defaultPrices = {
    description: "",
    distanceModeId: "",
    maxDistance: "",
    minDistance: "",
    provinceGroup: "",
  };
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [distance, setDistance] = useState({});

  const handleFetchData = async () => {
    try {
      const getListPrice = await axios.get("/DistanceMode", { headers });
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
        `/DistanceMode/api/UpdateDistanceMode?distanceModeId=${distance?.distanceModeId}`,
        distance,
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
        status: "error",
        description: `${err.message}`,
        isClosable: true,
      });
    }
  };
  const handleCreatePrice = async () => {
    try {
      const updatePrice = await axios.post(
        `/DistanceMode/api/CreateDistanceMode`,
        {
          provinceGroup: distance?.provinceGroup,
          description: distance?.description,
          minDistance: Number(distance?.minDistance),
          maxDistance: Number(distance?.maxDistance),
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
        status: "error",
        description: `${err.response.data}`,
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
        <ModalHeader>Cập nhật khoảng cách</ModalHeader>
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
        <ModalHeader>Tạo mới</ModalHeader>
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
      dataIndex: "distanceModeId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.distanceModeId - b?.distanceModeId,
    },
    {
      title: "Nhóm tỉnh",
      dataIndex: "provinceGroup",
      width: 300,
      filters: data
        ?.map((item) => ({
          text: item?.provinceGroup,
          value: item?.provinceGroup,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.provinceGroup?.includes(value),
    },
    {
      title: "Miêu tả",
      dataIndex: "description",
      filters: data
        ?.map((item) => ({
          text: item?.description,
          value: item?.description,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.description?.includes(value),
    },
    {
      title: "Khoảng cách tối thiểu (km)",
      dataIndex: "minDistance",
      filters: data
        ?.map((item) => ({
          text: item?.minDistance + " km",
          value: item?.minDistance,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.minDistance === value,
    },
    {
      title: "Khoảng cách tối đa (km)",
      dataIndex: "maxDistance",
      filters: data
        ?.map((item) => ({
          text: item?.maxDistance + " km",
          value: item?.maxDistance,
        }))
        .filter((item) => {
          if (!uniqueDescriptions[item.text]) {
            uniqueDescriptions[item.text] = true;
            return true;
          }
          return false;
        }),
      filterSearch: true,
      onFilter: (value, record) => record.maxDistance === value,
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
        rowKey="distanceModeId"
      />
      {ModalUpdate}
      {ModalAdd}
    </>
  );
}

export default TableComponent;
