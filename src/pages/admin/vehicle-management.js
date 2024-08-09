import { Button as ButtonAntd, Space, Table, Tag } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../../provider";
import { useEffect } from "react";
import {
  formatDate,
  getColorStatusVehicle,
  getStatusVehicle,
} from "../../helpers";
import { IoMdAdd } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { FormAddVehicle } from "../../components/Admin/FormAddVehicle";
import dayjs from "dayjs";
import { FORMAT_TIME_SUBMIT } from "../../components/Order/FormAdd";

const defaultVehicle = {
  licensePlate: "",
  type: "",
  capacity: "",
  status: 1,
  registrationDate: dayjs().format(FORMAT_TIME_SUBMIT),
};

const VehicleManagementPage = () => {
  const toast = useToast({ position: "top" });
  const [dataVehicle, setDataVehicle] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [vehicle, setVehicle] = useState(defaultVehicle);
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;

  const handleFetchData = async () => {
    const res = await axios.get("/Vehicle", { headers });
    if (res.status === 200) {
      setDataVehicle(res.data);
    }
  };

  const resetForm = () => {
    setReload(true);
    setOpenModal(false);
    setVehicle(defaultVehicle);
  };

  const handleCreateVehicle = async () => {
    try {
      const res = await axios.post("Vehicle/api/CreateCar", vehicle, {
        headers,
      });
      if (res.status === 200) {
        toast({
          title: "Tạo thành công.",
          status: "success",
          isClosable: true,
        });
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống !",
        description: `${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateVehicle = async () => {
    const { vehicleId, ...payloadUpdate } = vehicle;
    try {
      const res = await axios.put(
        `/Vehicle/api/UpdateCar?vehicleId=${vehicleId}`,
        payloadUpdate,
        { headers }
      );
      if (res.status === 200) {
        toast({
          title: "Sửa thông tin thành công !",
          status: "success",
          isClosable: true,
        });
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống !",
        description: `${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    if (reload) {
      handleFetchData();
      setReload(false);
    }
  }, [reload]);

  const columns = [
    {
      title: "Id",
      dataIndex: "vehicleId",
      key: "vehicleId",
      align: "center",
      width: "70px",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.vehicleId - b?.vehicleId,
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
      render: (value) => <Tag style={{ fontWeight: "500" }}>{value}</Tag>,
    },
    {
      title: "Ngày đăng kí",
      dataIndex: "registrationDate",
      key: "registrationDate",
      render: (value) => <span>{formatDate(value, false)}</span>,
    },
    {
      title: "Số khối",
      dataIndex: "capacity",
      key: "capacity",
      width: "120px",
      render: (value) => <Tag color="cyan">{value} m3</Tag>,
    },
    {
      title: "Trọng lượng",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: "150px",
      render: (value) => <Tag color="geekblue">{value} Tấn</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "200px",
      filters: [
        {
          text: "Đã xóa",
          value: 0,
        },
        {
          text: "Đang sẵn sàng",
          value: 1,
        },
        {
          text: "Đang bận",
          value: 2,
        },
        {
          text: "Đang gặp vấn đề",
          value: 3,
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        return (
          <Tag
            color={getColorStatusVehicle(status)}
            key={status}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            {getStatusVehicle(status)}
          </Tag>
        );
      },
    },
    {
      title: "Hoạt động",
      key: "action",
      align: "center",
      width: "150px",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              // hanldeUpdateModal(record);
              setOpenModal(true);
              setVehicle(record);
            }}
          >
            <AiFillEdit />
          </button>
          {/* <button
            onClick={() => {
              // handleDeleteAccount(record?.accountId);
            }}
          >
            <AiOutlineDelete />
          </button> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div>
        <ButtonAntd
          style={{ marginBottom: "10px", float: "right" }}
          type="primary"
          onClick={() => setOpenModal(true)}
        >
          <IoMdAdd />
        </ButtonAntd>
      </div>
      <Table
        loading={reload}
        dataSource={dataVehicle}
        columns={columns}
        rowKey="vehicleId"
      />
      <Modal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setVehicle(defaultVehicle);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thông tin xe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormAddVehicle vehicle={vehicle} setVehicle={setVehicle} />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="ghost"
              mr={3}
              onClick={() => {
                setOpenModal(false);
                setVehicle(defaultVehicle);
              }}
            >
              Đóng
            </Button>
            {vehicle?.vehicleId ? (
              <Button colorScheme="blue" onClick={handleUpdateVehicle}>
                Sửa
              </Button>
            ) : (
              <Button colorScheme="blue" onClick={handleCreateVehicle}>
                Thêm
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VehicleManagementPage;
