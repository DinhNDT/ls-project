"use client";

import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  Icon,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider";

const avatars = [
  {
    name: "Ryan Florence",
    url: "https://bit.ly/ryan-florence",
  },
  {
    name: "Segun Adebayo",
    url: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Kent Dodds",
    url: "https://bit.ly/kent-c-dodds",
  },
  {
    name: "Prosper Otemuyiwa",
    url: "https://bit.ly/prosper-baba",
  },
  {
    name: "Christian Nwamba",
    url: "https://bit.ly/code-beast",
  },
];

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const  logginRef = useRef(null);
  

  const loginContext = useContext(GlobalContext);
  const { setIsLogin, setUserInformation } = loginContext;

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      logginRef.current.click();
    }
  };

  const handleLoginFunction = async (e) => {
    e.preventDefault();
    try {
      // check username and password
      if (!username && !password) {
        alert("Please field username and password");
        return;
      }
      const payload = { username, password };
      const requestLoginFunction = await axios.post("/Login", payload);
      if (requestLoginFunction.status === 200) {
        const userDecode = requestLoginFunction.data;
        setUserInformation(userDecode);
        setIsLogin(true);
        alert("Đăng nhập thành công");
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
        alert("Đăng nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Đăng nhập thất bại");
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
          >
            Chào mừng đến với 
          </Heading>
          <Stack direction={"row"} spacing={4} align={"center"}>
            <AvatarGroup>
              {avatars.map((avatar) => (
                <Avatar
                  key={avatar.name}
                  name={avatar.name}
                  src={avatar.url}
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  size={useBreakpointValue({ base: "md", md: "lg" })}
                  position={"relative"}
                  zIndex={2}
                  _before={{
                    content: '""',
                    width: "full",
                    height: "full",
                    rounded: "full",
                    transform: "scale(1.125)",
                    bgGradient: "linear(to-bl, red.400,pink.400)",
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}
                />
              ))}
            </AvatarGroup>
            <Text fontFamily={"heading"} fontSize={{ base: "4xl", md: "6xl" }}>
              +
            </Text>
            <Flex
              align={"center"}
              justify={"center"}
              fontFamily={"heading"}
              fontSize={{ base: "sm", md: "lg" }}
              bg={"gray.800"}
              color={"white"}
              rounded={"full"}
              minWidth={useBreakpointValue({ base: "44px", md: "60px" })}
              minHeight={useBreakpointValue({ base: "44px", md: "60px" })}
              position={"relative"}
              _before={{
                content: '""',
                width: "full",
                height: "full",
                rounded: "full",
                transform: "scale(1.125)",
                bgGradient: "linear(to-bl, orange.400,yellow.400)",
                position: "absolute",
                zIndex: -1,
                top: 0,
                left: 0,
              }}
            >
              YOU
            </Flex>
          </Stack>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              color={"gray.800"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Join our team
              <Text as={"span"} bgColor={"#F56565"} bgClip="text">
                !
              </Text>
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              We will bring you great experiences and exciting amenities. Put
              customer satisfaction first!
            </Text>
          </Stack>
          <Box as={"form"} mt={4}>
            <Stack spacing={4}>
              <Input
                placeholder="username"
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
                placeholder="Password"
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
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
              mt={"20px"}
            >
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              <Text
                color={"blue.400"}
                cursor={"pointer"}
                _hover={{ textDecoration: "underline" }}
                as={Link}
                to={"/identify"}
              >
                Quên mật khẩu?
              </Text>
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
            <Stack
              mt={3}
              color={"blue.400"}
              _hover={{ textDecoration: "underline" }}
            >
              <Link to={"/sign-up"} style={{ margin: "0 auto" }}>
                Không có tài khoản? Đăng kí ngay
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      />
    </Box>
  );
}
