import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import logo from "../../../assets/img/delivery-truck.png";

export default function Footer({ ...rest }) {
  return (
    <Box
      // bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      {...rest}
    >
      <Box py={10}>
        <Flex
          align={"center"}
          _before={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            ml: 8,
          }}
        >
          <img src={logo} alt="" width={40} height={40} />{" "}
          <Text marginLeft="10px">LFH Project</Text>
        </Flex>
        <Text pt={6} fontSize={"sm"} textAlign={"center"}>
          © 2024 LFH Templates. All rights reserved
        </Text>
      </Box>
    </Box>
  );
}
