"use client";

import {
  Flex,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Box,
  Button,
  Link,
  useToast,
  Fade,
} from "@chakra-ui/react";
import { Checkbox, Form } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormCompanyInfo } from "../../components/Register/FormCompanyInfo";
import { FormUserInfo } from "../../components/Register/FormUserInfo";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const LINK_POLICY =
  "https://docs.google.com/document/d/1KRtwWgw9lFQap-qzTHs31p76g5SGtbsv/edit?usp=sharing&ouid=107245805655341164503&rtpof=true&sd=true";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [isReadPolicy, setIsReadPolicy] = useState();
  const [isSwitchForm, setIsSwitchForm] = useState(false);
  const toast = useToast({ position: "top" });
  const navigate = useNavigate();

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

  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      borderRadius={10}
      boxShadow={"lg"}
      width={700}
    >
      <Stack spacing={4} padding={25} paddingTop={5} width={"100%"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
            <Heading textAlign={"left"} size={"lg"}>
              Đăng kí ngay{" "}
              <Text
                as={"span"}
                bgColor={"#F56565"}
                bgClip="text"
                fontSize={"35px"}
              >
                !
              </Text>
            </Heading>
            <Text mt={2} color={"GrayText"}>
              Vui lòng nhập thông tin{" "}
              {!isSwitchForm ? (
                <span style={{ color: "#F56565", fontWeight: 500 }}>
                  Doanh Nghiệp
                </span>
              ) : (
                <span style={{ color: "#F56565", fontWeight: 500 }}>
                  Người Đại Diện Doanh Nghiệp
                </span>
              )}
            </Text>
          </Box>
          {isSwitchForm && (
            <Button
              leftIcon={<ArrowBackIcon />}
              size="md"
              variant={"link"}
              onClick={() => setIsSwitchForm(false)}
            >
              Quay lại
            </Button>
          )}
        </Box>
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
            <Stack position={"relative"}>
              <Fade
                in={isSwitchForm}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: isSwitchForm ? "5" : "1",
                }}
              >
                <Box>
                  <FormUserInfo />
                  <Box>
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
                    <Checkbox
                      onChange={(e) => setIsReadPolicy(e.target.checked)}
                    >
                      Tôi đã đọc và đồng ý với{" "}
                      <Link color={"blue.400"} href={LINK_POLICY} isExternal>
                        điều khoản
                      </Link>{" "}
                      của người dùng{" "}
                    </Checkbox>
                  </Box>
                </Box>
              </Fade>
              <Fade
                in={!isSwitchForm}
                style={{
                  zIndex: !isSwitchForm ? "5" : "1",
                }}
              >
                <Box>
                  <FormCompanyInfo />
                  <Button
                    float={"right"}
                    size="md"
                    bg={"#F56565"}
                    color={"white"}
                    _hover={{
                      bg: "pink.300",
                    }}
                    onClick={() => setIsSwitchForm(true)}
                    rightIcon={<ArrowForwardIcon />}
                  >
                    Tiếp theo
                  </Button>
                </Box>
              </Fade>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Flex>
  );
}
