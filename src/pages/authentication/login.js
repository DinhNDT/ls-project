"use client";

import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider";
import imgLogin from "../../assets/img/mobile-password-forgot.png";
import Aos from "aos";

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast({ position: "top" });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const logginRef = useRef(null);

  const loginContext = useContext(GlobalContext);
  const { setUserInformation, setIsLogin } = loginContext;

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      logginRef.current.click();
    }
  };

  const handleLoginFunction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { username, password };
      const requestLoginFunction = await axios.post("/Login", payload);
      if (requestLoginFunction.status === 200) {
        const userDecode = requestLoginFunction.data;
        setUserInformation(userDecode);
        setIsLogin(true);
        toast({
          title: "Đăng nhập thành công",
          status: "success",
          isClosable: true,
        });
        const userRole = userDecode.role;
        if (userRole === "Admin") {
          navigate("/admin");
          return;
        }
        if (userRole === "Staff") {
          navigate("/staff/manage-order");
          return;
        }
        if (userRole === "Company") {
          navigate("/company/manage-order");
          return;
        }
        if (userRole === "Stocker") {
          navigate("/stocker/order-delivery");
          return;
        }
        navigate("/");
      } else {
        toast({
          title: "Đăng nhập thất bại",
          status: "error",
          description: "Sai tên mật khẩu hoặc tài khoản",
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (err) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Sai tên mật khẩu hoặc tài khoản",
        status: "error",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <Container maxW={"7xl"} data-aos="fade-up">
      <Box position={"relative"}>
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <img src={imgLogin} alt="" width={"95%"} height={"95%"} />
          </Stack>
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={5}
            // p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
            maxH={350}
            position={"relative"}
            boxShadow={"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}
          >
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Đăng nhập ngay
                <Text as={"span"} bgColor={"#F56565"} bgClip="text">
                  !
                </Text>
              </Heading>
            </Stack>
            <Box as={"form"} mt={4}>
              <Stack spacing={4}>
                <Input
                  placeholder="Tên đăng nhập"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  value={username}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  placeholder="Mật khẩu"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="password"
                  onKeyDown={handleKeyPress}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>

              <Button
                fontFamily={"heading"}
                mt={5}
                w={"full"}
                //   bgGradient="linear(to-r, red.400,pink.400)"
                bgColor={"#F56565"}
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                ref={logginRef}
                onClick={handleLoginFunction}
              >
                Đăng nhập
              </Button>
              {/* <Stack
              mt={3}
              color={"blue.400"}
              _hover={{ textDecoration: "underline" }}
            >
              <Link to={"/sign-up"} style={{ margin: "0 auto" }}>
                Không có tài khoản? Đăng kí ngay
              </Link>
            </Stack> */}
            </Box>
            {isLoading && (
              <Box
                position={"absolute"}
                width={"100%"}
                height={"100%"}
                backgroundColor={"black"}
                opacity={0.3}
                borderRadius={15}
                top={0}
                left={0}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                zIndex={10}
              >
                <Spinner color="red" size="xl" />
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </Container>
  );
}
