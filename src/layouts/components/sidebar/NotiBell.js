import { Badge, Empty, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Box, Text } from "@chakra-ui/react";
import { CardNoti } from "./CardNoti";
import { GlobalContext } from "../../../provider";
import axios from "axios";
import { useClickOutside } from "../../../hooks/use-click-outside";
import "./style.css";

const SECOND = 5000;

export const NotiBell = () => {
  const [showNoti, setShowNoti] = useState(false);
  const [reload, setReload] = useState(false);
  const [dataNoti, setDataNoti] = useState([]);
  const ref = useClickOutside(() => setShowNoti(false));

  const userContext = useContext(GlobalContext);
  const { userInformation } = userContext;

  const countNoti = dataNoti.filter((value) => value.status === true).length;

  const handleFetchData = async () => {
    try {
      const dataNoti = await axios.get(
        `/Notification/notification/${userInformation.accounId}`
      );

      if (dataNoti.status === 200) {
        setDataNoti(
          dataNoti.data.sort((a, b) => b.notifictionId - a.notifictionId)
        );
      }
    } catch (error) {}
  };

  const onShowDropDownNoti = () => {
    setShowNoti(!showNoti);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    if (reload) handleFetchData();
    const clearTime = setTimeout(() => {
      setReload(false);
    }, 500);
    return () => {
      clearTimeout(clearTime);
    };
  }, [reload]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleFetchData();
  //   }, SECOND);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <Box ref={ref} position="relative">
      <Box cursor="pointer" userSelect="none" onClick={onShowDropDownNoti}>
        <Badge count={countNoti} size="small">
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
          borderRadius={5}
          lineHeight="normal"
        >
          <Box
            p={3}
            display="flex"
            justifyContent={"center"}
            alignItems={"center"}
            alignContent={"center"}
            borderBottom={"1px solid #dadada"}
          >
            <Text fontSize="md" marginRight="5px">
              Thông Báo
            </Text>
            <Badge
              style={{ marginTop: "3px" }}
              size="small"
              count={countNoti}
            />
          </Box>
          <Spin spinning={reload} size="default">
            {dataNoti.length > 0 ? (
              <Box
                overflowY={"scroll"}
                height={"200px"}
                display="flex"
                flexDirection="column"
                backgroundColor={"#edf1f4"}
              >
                {dataNoti.map((data) => (
                  <CardNoti
                    key={data.notifictionId}
                    data={data}
                    role={userInformation?.role}
                    setShowNoti={setShowNoti}
                    setReload={setReload}
                  />
                ))}
              </Box>
            ) : (
              <Box p={2}>
                <Empty
                  style={{ width: 200, fontSize: "12px" }}
                  imageStyle={{ height: 50 }}
                />
              </Box>
            )}
          </Spin>
          <Box
            onClick={() => setReload(true)}
            p={4}
            display="flex"
            justifyContent={"center"}
            alignItems={"center"}
            cursor={"pointer"}
            borderTop={"1px solid #dadada"}
          >
            <Text color="#1677ff">Tải lại thông báo</Text>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
