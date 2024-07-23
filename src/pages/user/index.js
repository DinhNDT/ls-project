import { Avatar, Form, Input, Select, Upload } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FiEdit3, FiX } from "react-icons/fi";
import axios from "axios";
import { GlobalContext } from "../../provider";
const { Option } = Select;

const UserPage = () => {
  const toast = useToast({ position: "top" });
  const [dataCompany, setDataCompany] = useState({});

  const [form] = Form.useForm();
  const userContext = useContext(GlobalContext);
  const { headers, userInformation } = userContext;
  const [isEdit, setIsEdit] = useState(true);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);

  const apiGetPublicDistrict = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      setDistrictsList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard = async (districtId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );

      setWardsList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDistrictChange = (id) => {
    apiGetPublicWard(id);
  };

  const handleSetField = ({
    account,
    email,
    companyName,
    companyId,
    companyLocation,
  }) => {
    let address = companyLocation?.split(",").at(0)?.trim();
    let ward = companyLocation?.split(",").at(1)?.trim();
    let district = companyLocation?.split(",").at(2)?.trim();
    let province = companyLocation?.split(",").at(3)?.trim();

    form.setFieldsValue({
      fullName: account.fullName,
      email: email.trim(),
      companyName,
      phone: account.phone,
      companyId,
      province,
      district,
      ward,
      address,
    });
  };

  const apiGetCompanyInformation = async (id) => {
    try {
      const getCompany = await axios.get(
        `/Company?companyId=${userInformation.idByRole}`,
        {
          headers,
        }
      );
      if (getCompany.status === 200) {
        let companyData = getCompany.data;
        handleSetField(companyData[0]);
        setDataCompany(companyData[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFinish = (value) => {
    handleEditUser(value);
  };

  const handleEditUser = async ({
    province,
    district,
    ward,
    address,
    companyId,
    ...rest
  }) => {
    const payload = {
      ...rest,
      companyLocation: `${address}, ${ward}, ${district}, Thành Phố Hồ Chí Minh`,
      img: "https://i.imgur.com/9i2ANHO.jpeg",
      dateOfBirth: "2024-06-11T07:55:03.452Z",
      userName: dataCompany.account.userName,
      password: dataCompany.account.password,
      citizenId: dataCompany.citizenId,
    };

    try {
      const res = await axios.put(
        `/Company/${userInformation.idByRole}`,
        payload,
        { headers }
      );
      if (res.status === 200) {
        toast({
          title: "Sửa thông tin thành công !",
          status: "success",
          isClosable: true,
        });
        setIsEdit(true);
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống !",
        description: `${error.message}`,
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    apiGetCompanyInformation();
    apiGetPublicDistrict("79");
  }, []);

  const props = {
    name: "file",
    action: `https://nhatlocphatexpress.azurewebsites.net/Accounts/api/accounts/upload-image/${userInformation.accounId}`,
    headers: headers,

    onChange(info) {
      // console.log("info:", typeof info.file.originFileObj);
      // upLoadImage(info.file.originFileObj);

      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        toast({
          title: "Cập nhật hình ảnh thành công !",
          status: "success",
          isClosable: true,
        });
      } else if (info.file.status === "error") {
        toast({
          title: "Cập nhật hình ảnh thất bại !",
          status: "error",
          isClosable: true,
        });
      }
    },
  };

  const upLoadImage = async (image) => {
    try {
      const res = await axios.put(
        `https://nhatlocphatexpress.azurewebsites.net/Accounts/api/accounts/upload-image/${userInformation.accounId}`,
        { image },
        { headers }
      );
      // console.log("res:", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box position={"relative"}>
      <Button
        position={"absolute"}
        top={0}
        right={0}
        float={"right"}
        bg={"#2b6cb0"}
        color={"white"}
        _hover={{
          bg: "blue.500",
        }}
        size="sm"
        fontWeight="400"
        onClick={() => setIsEdit(!isEdit)}
      >
        {isEdit ? <FiEdit3 /> : <FiX />}
      </Button>
      <Flex flexDirection="column" gap={5} p={10}>
        <Box textAlign={"center"} position={"relative"}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={dataCompany?.account?.img}
          />
          <Upload method="PUT" {...props} fileList={null}>
            <IconButton
              position={"absolute"}
              bottom={0}
              right={"46%"}
              isRound={true}
              size={"xs"}
              variant="solid"
              colorScheme="teal"
              aria-label="Done"
              fontSize="14px"
              icon={<FiEdit3 />}
            />
          </Upload>
        </Box>
        <Form form={form} onFinish={onFinish} layout="vertical" size="middle">
          <Flex gap={5}>
            <Box width={"50%"}>
              <FormLabel>Người Đại Diện</FormLabel>
              <Form.Item name="fullName">
                <Input disabled={isEdit} />
              </Form.Item>
            </Box>
            <Box width={"50%"}>
              <FormLabel>Email</FormLabel>
              <Form.Item name="email">
                <Input disabled={isEdit} />
              </Form.Item>
            </Box>
          </Flex>
          <Flex gap={5}>
            <Box width={"50%"}>
              <FormLabel>Tên Công Ty</FormLabel>
              <Form.Item name="companyName">
                <Input disabled={isEdit} />
              </Form.Item>
            </Box>
            <Box width={"50%"}>
              <FormLabel>Số Điện Thoại</FormLabel>
              <Form.Item name="phone">
                <Input disabled={isEdit} />
              </Form.Item>
            </Box>
          </Flex>
          <Flex gap={5}>
            <Box width={"50%"}>
              <FormLabel>Mã Số Thuế</FormLabel>
              <Form.Item name="companyId">
                <Input disabled={isEdit} />
              </Form.Item>
            </Box>
            <Box width={"50%"}>
              <HStack>
                <FormControl>
                  <FormLabel>Tỉnh/Thành</FormLabel>
                  <Form.Item name="province">
                    <Select disabled>
                      <Option key={"79"} value={"Thành Phố Hồ Chí Minh"}>
                        Thành Phố Hồ Chí Minh
                      </Option>
                    </Select>
                  </Form.Item>
                </FormControl>
                <FormControl>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Form.Item name="district">
                    <Select
                      disabled={isEdit}
                      onChange={(_, option) => {
                        handleDistrictChange(option.key);
                      }}
                      placeholder="Chọn Quận/Huyện"
                    >
                      {districtsList.map((district) => (
                        <Option key={district.id} value={district.full_name}>
                          {district.full_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </FormControl>
                <FormControl>
                  <FormLabel>Xã/Phường</FormLabel>
                  <Form.Item name="ward">
                    <Select disabled={isEdit} placeholder="Chọn Xã/Phường">
                      {wardsList.map((ward) => (
                        <Option key={ward.id} value={ward.full_name}>
                          {ward.full_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>Địa Chỉ</FormLabel>
                <Form.Item name="address">
                  <Input disabled={isEdit} />
                </Form.Item>
              </FormControl>
            </Box>
          </Flex>

          {!isEdit && (
            <Button
              mt={10}
              float={"right"}
              width={250}
              bg={"#2b6cb0"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              size="sm"
              fontWeight="400"
              onClick={() => form.submit()}
            >
              Xác Nhận Sửa Thông Tin
            </Button>
          )}
        </Form>
      </Flex>
    </Box>
  );
};

export default UserPage;
