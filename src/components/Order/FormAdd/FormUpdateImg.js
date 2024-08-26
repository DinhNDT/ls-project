import { Text, useToast, Button, Flex, Divider, Box } from "@chakra-ui/react";
import Dragger from "antd/es/upload/Dragger";
import React, { useContext, useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import { BsSendCheck } from "react-icons/bs";
import { OrderContext } from "../../../provider/order";
import { QRCode, Button as ButtonAntd } from "antd";
import { LuDownload } from "react-icons/lu";
import { doDownload } from "../../../helpers";

export const URL_TRACKING_ORDER = `https://${process.env.REACT_APP_URL}/tracking-order`;

export const FormUpdateImg = ({ id, trackingNumber }) => {
  const toast = useToast({ position: "top" });
  const [isUpdated, setIsUpdated] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
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
        setIsUpdated(true);
        setShowWarning(false);
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
    maxCount: 1,
  };

  const downloadCanvasQRCode = () => {
    const canvas = document.getElementById("myqrcode")?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      doDownload(url, `QRCode_MaDonHang_${id}.png`);
    }
  };

  const handleConfirm = () => {
    if (isUpdated) {
      setKeySelected("1");
    } else {
      setShowWarning(true);
    }
  };

  const qrUrl = `${URL_TRACKING_ORDER}/${trackingNumber}`;

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => {
      window.removeEventListener("beforeunload", unloadCallback);
    };
  }, []);

  return (
    <Flex justifyContent="space-between" flexDirection="column" gap={"100px"}>
      <div style={{ display: "flex", gap: "10px" }}>
        <Box width="70%">
          <Text mb={"15px"} fontSize={19}>
            Cập nhật hình ảnh gói hàng{" "}
            <span style={{ color: "#ff4d4f" }}>*</span>
          </Text>

          <Dragger
            {...props}
            style={{ border: showWarning ? "1px solid red" : "unset" }}
          >
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

          {showWarning && (
            <Text color="#ff4d4f" fontSize="16px">
              Vui lòng cập nhật hình ảnh gói hàng
            </Text>
          )}
        </Box>
        <Divider orientation="vertical" />
        <Box
          id="myqrcode"
          width="30%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Text mb={"15px"} fontSize={19}>
            Mã QR thông tin gói hàng
          </Text>
          <QRCode
            size={200}
            type={"canvas"}
            value={qrUrl}
            bgColor="#fff"
            style={{ marginBottom: 16 }}
          />
          <ButtonAntd
            style={{ width: "180px" }}
            icon={<LuDownload fontSize={"19px"} />}
            type="default"
            onClick={downloadCanvasQRCode}
          ></ButtonAntd>
        </Box>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "30px",
        }}
      >
        <Button
          bg={"#2b6cb0"}
          color={"white"}
          colorScheme="blue"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={handleConfirm}
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
