import { Text, useToast, Button, Flex } from "@chakra-ui/react";
import Dragger from "antd/es/upload/Dragger";
import React, { useContext } from "react";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import { RiSkipForwardFill } from "react-icons/ri";
import { BsSendCheck } from "react-icons/bs";
import { OrderContext } from "../../../provider/order";

export const FormUpdateImg = ({ id }) => {
  const toast = useToast({ position: "top" });
  const orderContext = useContext(OrderContext);
  const { setKeySelected } = orderContext;

  const upLoadImage = async (file, options) => {
    try {
      const res = await axios.put(
        `/ordersEvidence/envidence?orderId=${id}`,
        { image: file },
        {
          headers: {
            "content-type":
              "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
          },
        }
      );
      if (res.status === 200) {
        toast({
          title: "Cập nhật hình ảnh thành công !",
          status: "success",
          isClosable: true,
        });
        options.onSuccess({ data: "image" }, options.file);
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống !",
        status: "error",
        description: `${error.message}`,
        isClosable: true,
      });
    }
  };
  const props = {
    name: "file",
    customRequest(options) {
      const data = new FormData();
      data.append("file", options.file);
      upLoadImage(data.get("file"), options);
    },
    listType: "picture",
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  return (
    <Flex justifyContent="space-between" flexDirection="column">
      <div>
        <Text mb={"15px"} fontSize={19}>
          Cập nhật hình ảnh gói hàng
        </Text>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click hoặc kéo thả file vào vùng này để tải ảnh lên !
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ tải lên 1 ảnh. Nghiêm cấm tải lên dữ liệu trái pháp luật !
          </p>
        </Dragger>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <Button
          size="sm"
          rightIcon={<RiSkipForwardFill />}
          onClick={() => setKeySelected("1")}
        >
          Bỏ qua
        </Button>
        <Button
          bg={"#2b6cb0"}
          color={"white"}
          colorScheme="blue"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => setKeySelected("1")}
          w={150}
          size="sm"
          rightIcon={<BsSendCheck />}
        >
          Xác nhận
        </Button>
      </div>
    </Flex>
  );
};
