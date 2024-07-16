import { Badge } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Box } from "@chakra-ui/react";
import { CardNoti } from "./CardNoti";
import { GlobalContext } from "../../../provider";
import axios from "axios";
import { useClickOutside } from "../../../hooks/use-click-outside";

export const NotiBell = () => {
  const [showNoti, setShowNoti] = useState(false);
  const ref = useClickOutside(() => setShowNoti(false));

  const userContext = useContext(GlobalContext);
  const { userInformation } = userContext;

  const handleFetchData = async () => {
    try {
      const dataNoti = await axios.get(
        `/Notification/notification/${userInformation.accounId}`
      );

      if (dataNoti.status === 200) {
        // console.log("dataNoti:", dataNoti.data);
      }
    } catch (error) {}
  };

  const onShowDropDownNoti = () => {
    setShowNoti(!showNoti);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <Box ref={ref} position="relative">
      <Box cursor="pointer" userSelect="none" onClick={onShowDropDownNoti}>
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: "17px" }} />
        </Badge>
      </Box>
      {showNoti ? (
        <Box
          boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
          backgroundColor="white"
          position="absolute"
          top={"70%"}
          right={0}
          zIndex={99}
          lineHeight="normal"
          p={2}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <CardNoti />
          <CardNoti />
          <CardNoti />
        </Box>
      ) : null}
    </Box>
  );
};
