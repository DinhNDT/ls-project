import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Button,
  Text,
  Stack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
} from "@chakra-ui/react";
import logo from "../../../assets/img/delivery-truck.png";
// eslint-disable-next-line
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../provider";
import { useContext } from "react";

const MobileNav = ({ onOpen, notHaveSidebar, ...rest }) => {
  const userContext = useContext(GlobalContext);
  const { userInformation } = userContext;
  const flexBG = useColorModeValue("white", "gray.900");
  const flexBB = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();

  return (
    <Flex
      ml={{ base: 0, md: notHaveSidebar ? 0 : 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      borderBottomColor={flexBB}
      justifyContent={notHaveSidebar ? "space-between" : "flex-end"}
      bg={flexBG}
      {...rest}
    >
      <Flex alignItems="center" gap={35}>
        {notHaveSidebar && (
          <Flex alignItems="center" gap={2}>
            <img src={logo} alt="" width={40} height={40} />
            <Text
              fontSize="x-large"
              fontFamily="monospace"
              fontWeight="bold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Logistics For Household
            </Text>
          </Flex>
        )}
        {!notHaveSidebar && (
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
        )}
        <Tabs
          display={{ base: "none", md: "none", lg: "unset" }}
          position="relative"
          variant="unstyled"
        >
          <TabList>
            <Tab height={75} onClick={() => navigate("/")}>
              Trang chủ
            </Tab>
          </TabList>
          <TabIndicator height="2px" bg="blue.500" borderRadius="1px" />
        </Tabs>
      </Flex>
      {notHaveSidebar ? (
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Button
            as={"a"}
            fontSize={"sm"}
            fontWeight={400}
            display={{ base: "none", md: "inline-flex" }}
            variant={"link"}
            onClick={() => navigate("/sign-up")}
          >
            Đăng kí
          </Button>
          <Button
            as={"a"}
            fontSize={"sm"}
            fontWeight={600}
            display={{ base: "none", md: "inline-flex" }}
            color={"white"}
            bg={"#F56565"}
            _hover={{
              bg: "pink.300",
            }}
            onClick={() => {
              navigate("/sign-in");
            }}
          >
            Đăng nhập
          </Button>
        </Stack>
      ) : (
        <HStack spacing={{ base: "0", md: "6" }}>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={
                      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{userInformation?.userName}</Text>
                    <Text fontSize="xs" color={"gray.600"}>
                      {userInformation?.role}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList bg={flexBG} borderColor={flexBB} zIndex={"9999"}>
                <Link to="/admin/profile">
                  <MenuItem>Hồ sơ</MenuItem>
                </Link>
                <MenuDivider />
                <Link to="/">
                  <MenuItem>Đăng xuất</MenuItem>
                </Link>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      )}
    </Flex>
  );
};

function Header({ onOpen, notHaveSidebar }) {
  return <MobileNav onOpen={onOpen} notHaveSidebar={notHaveSidebar} />;
}

export default Header;
