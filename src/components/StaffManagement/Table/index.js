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
import FormUpdate from "../FormUpdate";
import { IoMdAdd } from "react-icons/io";
import FormAdd from "../FormAdd";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../provider";
import { formatDate } from "../../../helpers";
import { Space, Table, Button as ButtonAntd } from "antd";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";

function TableComponent() {
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;
  const defaultPrices = {
    userName: "",
    password: "",
    phone: "",
    roleId: "1",
    email: "",
    fullName: "",
    dateOfBirth: "",
    img: "",
    status: true,
  };
  const toast = useToast({ position: "top" });
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [data, setData] = useState([]);
  const [account, setAccount] = useState({});
  const [reload, setReload] = useState(false);

  const handleFetchData = async () => {
    try {
      const getListPrice = await axios.get(
        "https://nhatlocphatexpress.azurewebsites.net/Accounts",
        { headers }
      );
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
        `https://nhatlocphatexpress.azurewebsites.net/Accounts/api/UpdateAccounts?accountId=${account?.accountId}`,
        account,
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
        setAccount(defaultPrices);
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
  const handleCreatePrice = async () => {
    const url =
      account?.roleId === "5"
        ? "/Drivers/api/CreateDriver"
        : `https://nhatlocphatexpress.azurewebsites.net/Accounts/api/CreateAccounts`;
    try {
      const updatePrice = await axios.post(url, account, { headers });

      if (updatePrice.status === 200) {
        toast({
          title: "Tạo thành công.",
          status: "success",
          isClosable: true,
        });
        setReload(true);
        setOpenModalAdd(false);
        setAccount(defaultPrices);
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

  const hanldeUpdateModal = (item) => {
    setAccount({ ...item, status: true });
    setOpenModalUpdate(true);
  };

  const handleDeleteAccount = async (id) => {
    try {
      const updatePrice = await axios.delete(
        `https://nhatlocphatexpress.azurewebsites.net/Accounts/${id}`,
        { headers }
      );

      if (updatePrice.status === 200) {
        toast({
          title: "Xóa thành công !",
          status: "success",
          isClosable: true,
        });
        setReload(true);
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

  const columns = [
    {
      title: "Id",
      dataIndex: "accountId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a?.accountId - b?.accountId,
    },
    {
      title: "Tên",
      dataIndex: "userName",
      defaultSortOrder: "userName",
      filters: data?.map((item) => ({
        text: item?.userName,
        value: item?.userName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.userName.includes(value),
      width: "15%",
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      filters: [
        {
          text: "Admin",
          value: 1,
        },
        {
          text: "Staff",
          value: 2,
        },
        {
          text: "Stocker",
          value: 3,
        },
        {
          text: "Company",
          value: 4,
        },
        {
          text: "Driver",
          value: 5,
        },
      ],
      onFilter: (value, record) => record.roleId === value,
      width: "15%",
      render: (roleId) => (
        <p>
          {roleId === 1
            ? "Admin"
            : roleId === 2
            ? "Staff"
            : roleId === 3
            ? "Stocker"
            : roleId === 4
            ? "Company"
            : "Driver"}
        </p>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      render: (dateOfBirth) => <p>{formatDate(dateOfBirth, false)}</p>,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      filters: data?.map((item) => ({
        text: item?.phone,
        value: item?.phone,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.phone.includes(value),
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      defaultSortOrder: "email",
      filters: data?.map((item) => ({
        text: item?.email,
        value: item?.email,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.email.includes(value),
      width: "15%",
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
          <a
            onClick={() => {
              handleDeleteAccount(record?.accountId);
            }}
          >
            <AiOutlineDelete />
          </a>
        </Space>
      ),
    },
  ];

  let ModalUpdate = (
    <Modal
      isOpen={openModalUpdate}
      onClose={() => {
        setOpenModalUpdate(false);
        setAccount(defaultPrices);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật người dùng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormUpdate account={account} setAccount={setAccount} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setOpenModalUpdate(false);
              setAccount(defaultPrices);
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
    <Modal
      isOpen={openModalAdd}
      onClose={() => {
        setOpenModalAdd(false);
        setAccount(defaultPrices);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm người dùng mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormAdd account={account} setAccount={setAccount} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            variant="ghost"
            mr={3}
            onClick={() => {
              setOpenModalAdd(false);
              setAccount(defaultPrices);
            }}
          >
            Đóng
          </Button>
          <Button colorScheme="blue" onClick={handleCreatePrice}>
            Thêm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

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
