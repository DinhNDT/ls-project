"use client";

import {
  Flex,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Box,
  FormControl,
  FormLabel,
  Button,
  Link,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Checkbox, Form, Input, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LINK_POLICY =
  "https://docs.google.com/document/d/1KRtwWgw9lFQap-qzTHs31p76g5SGtbsv/edit?usp=sharing&ouid=107245805655341164503&rtpof=true&sd=true";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [isReadPolicy, setIsReadPolicy] = useState();
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const toast = useToast({ position: "top" });
  const navigate = useNavigate();

  const apiGetPublicProvinces = async () => {
    try {
      const response = await axios.get(
        "https://esgoo.net/api-tinhthanh/1/0.htm"
      );
      setProvincesList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

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

  const handleProvinceChange = (provinceId) => {
    apiGetPublicDistrict(provinceId);
  };

  const handleDistrictChange = (id) => {
    apiGetPublicWard(id);
  };

  const apiPostCreateCompany = async (payload) => {
    try {
      const response = await axios.post("/Company/api/CreateCompany", payload);
      if (response.status === 200) {
        toast({
          title: "Đăng ký thành công",
          status: "success",
          isClosable: true,
        });
        navigate("/sign-in");
      }
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const onFinish = (valueForm) => {
    const {
      province,
      ward,
      district,
      address,
      confirm,
      companyId,
      citizenId,
      ...rest
    } = valueForm;

    const formSubmit = {
      ...rest,
      img: "https://i.imgur.com/9i2ANHO.jpeg",
      companyLocation: `${address}, ${ward}, ${district}, ${province}`,
      dateOfBirth: "2024-06-11T07:55:03.452Z",
      companyId: Number(companyId),
      citizenId: Number(citizenId),
    };

    apiPostCreateCompany(formSubmit);
  };

  useEffect(() => {
    apiGetPublicProvinces();
  }, []);

  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      borderRadius={10}
      boxShadow={"lg"}
      width={700}
    >
      <Stack spacing={4} padding={25} paddingTop={0} width={"100%"}>
        <Stack align={"center"}>
          <Heading textAlign={"center"}>
            Đăng kí ngay{" "}
            <Text
              as={"span"}
              bgColor={"#F56565"}
              bgClip="text"
              fontSize={"55px"}
            >
              !
            </Text>
          </Heading>
        </Stack>
        <Box rounded={"lg"}>
          <Form
            form={form}
            size="middle"
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            scrollToFirstError
          >
            <Stack spacing={1}>
              <FormControl isRequired>
                <FormLabel>Tài Khoản</FormLabel>
                <Form.Item
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên tài khoản",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mật Khẩu</FormLabel>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Nhập Lại Mật Khẩu</FormLabel>
                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khậu nhập không khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tên Công Ty</FormLabel>
                <Form.Item
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên công ty",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mã Số Thuế</FormLabel>
                <Form.Item
                  name="companyId"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Mã Số Thuế",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Căn Cước Công Dân</FormLabel>
                <Form.Item
                  name="citizenId"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Căn Cước Công Dân",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tên Người Đại Diện</FormLabel>
                <Form.Item
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tên Người Đại Diện",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Số Điện Thoại</FormLabel>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Số Điện Thoại",
                    },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email Công Ty</FormLabel>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tên Email Công Ty",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </FormControl>
              <HStack>
                <FormControl isRequired>
                  <FormLabel>Tỉnh/Thành</FormLabel>
                  <Form.Item
                    name="province"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Tỉnh/Thành",
                      },
                    ]}
                  >
                    <Select
                      onChange={(_, option) => {
                        handleProvinceChange(option.key);
                      }}
                      placeholder="Chọn Tỉnh/thành"
                    >
                      {provincesList
                        .filter((value) => value.id === "79")
                        .map((province) => (
                          <option key={province.id} value={province.full_name}>
                            {province.full_name}
                          </option>
                        ))}
                    </Select>
                  </Form.Item>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Form.Item
                    name="district"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Quận/Huyện",
                      },
                    ]}
                  >
                    <Select
                      onChange={(_, option) => {
                        handleDistrictChange(option.key);
                      }}
                      placeholder="Chọn Quận/Huyện"
                    >
                      {districtsList.map((district) => (
                        <option key={district.id} value={district.full_name}>
                          {district.full_name}
                        </option>
                      ))}
                    </Select>
                  </Form.Item>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Xã/Phường</FormLabel>
                  <Form.Item
                    name="ward"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Xã/Phường",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn Xã/Phường">
                      {wardsList.map((ward) => (
                        <option key={ward.id} value={ward.full_name}>
                          {ward.full_name}
                        </option>
                      ))}
                    </Select>
                  </Form.Item>
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Địa Chỉ</FormLabel>
                <Form.Item
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Địa Chỉ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  isDisabled={!isReadPolicy}
                  size="lg"
                  bg={"#F56565"}
                  color={"white"}
                  _hover={{
                    bg: "pink.300",
                  }}
                  onClick={() => form.submit()}
                >
                  Đăng kí
                </Button>
              </Stack>
              <Stack>
                <Checkbox onChange={(e) => setIsReadPolicy(e.target.checked)}>
                  Tôi đã đọc và đồng ý với{" "}
                  <Link color={"blue.400"} href={LINK_POLICY} isExternal>
                    điều khoản
                  </Link>{" "}
                  của người dùng{" "}
                </Checkbox>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Flex>
  );
}
