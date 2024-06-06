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
  useBreakpointValue,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider";

const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="161" r="111" fill="#F56565" />
      {/* <circle cx='244' cy='206' r='139' fill='#ED64A6' /> */}
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="355.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast({ position: "top" });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const logginRef = useRef(null);

  const loginContext = useContext(GlobalContext);
  const { setIsLogin, setUserInformation } = loginContext;

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      logginRef.current.click();
    }
  };

  const handleLoginFunction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // check username and password
      if (!username && !password) {
        alert("Please field username and password");
        setLoading(false);
        return;
      }
      const payload = { username, password };
      const requestLoginFunction = await axios.post("/Login", payload);
      if (requestLoginFunction.status === 200) {
        const userDecode = requestLoginFunction.data;
        setUserInformation(userDecode);
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
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Đăng nhập thất bại",
        status: "error",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            textAlign={"center"}
          >
            Chào mừng đến với hệ thống Logistic
          </Heading>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
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
  );
}
