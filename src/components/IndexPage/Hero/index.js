import {
  Container,
  Stack,
  Flex,
  Box,
  Text,
  Button,
  Image,
  InputGroup,
  InputLeftAddon,
  Input as InputC,
  InputRightElement,
} from "@chakra-ui/react";
import { Form, Input } from "antd";
import imgHomePage from "../../../assets/img/delivery-man.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CallToActionWithVideo() {
  const navigate = useNavigate();

  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);

  const onClickSendTracking = () => {
    setLoading(true);
    setTimeout(() => navigate(`tracking-order/${trackingId}`), 300);
  };

  return (
    <Container maxW={"7xl"} data-aos="fade-up">
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        pb={{ base: 14, md: 16 }}
        pt={{ base: 14, md: 12 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Box
            border={"1px solid #E5E5E5"}
            borderRadius={10}
            p={25}
            boxShadow={" rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
            backgroundColor={"white"}
          >
            <Text fontSize={24} fontWeight={500}>
              Kiểm tra đơn hàng
            </Text>
            <Box mt={25}>
              <InputGroup>
                <InputLeftAddon>Mã đơn hàng:</InputLeftAddon>
                <InputC
                  value={trackingId}
                  type="tel"
                  placeholder="Nhập mã đơn hàng"
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onClickSendTracking()}
                />

                <InputRightElement width="3.5rem">
                  <Button
                    isDisabled={!trackingId}
                    isLoading={loading}
                    h="1.75rem"
                    size="sm"
                    onClick={onClickSendTracking}
                  >
                    Gửi
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </Box>
          <Box
            border={"1px solid #E5E5E5"}
            borderRadius={10}
            p={25}
            boxShadow={" rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
            backgroundColor={"white"}
          >
            <Text fontSize={24} fontWeight={500}>
              Liên hệ với chúng tôi
            </Text>
            <Box mt={25}>
              <Form layout="vertical" style={{ maxWidth: 600 }} size="middle">
                <Form.Item label="Họ Và Tên:">
                  <Input placeholder="Nhập họ tên" />
                </Form.Item>
                <Form.Item label="Số Điện Thoại:">
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item label="Email:">
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item label="Nội Dung:">
                  <Input.TextArea placeholder="Nhập nội dung" />
                </Form.Item>
              </Form>
              <Button h="2.55rem" size="md" onClick={() => {}} float={"right"}>
                Gửi
              </Button>
            </Box>
          </Box>
        </Stack>
        <Flex
          flex={1}
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          {/* Your Video Component */}
          <Box>
            <Image
              alt={"Hero Image"}
              fit={"cover"}
              align={"center"}
              w={"90%"}
              h={"90%"}
              src={imgHomePage}
            />
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}
