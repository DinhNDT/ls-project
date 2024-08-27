import React, { useContext, useEffect, useState } from "react";
import { Box, useToast, Stack, useDisclosure } from "@chakra-ui/react";
import { GlobalContext } from "../../../provider";
import { convertOrder, getWhoEnum } from "../../../helpers";
import axios from "axios";
import { OrderContext } from "../../../provider/order";
import dayjs from "dayjs";
import { FormInfo } from "./FormInfo";
import { ButtonUploadFile } from "./ButtonUploadFile";
import { ModalUpdateOrderProduct } from "./ModalUpdateOrderProduct";
import { OrderProduct } from "./OrderProduct";
import { WrapperReview } from "../WrapperReview";

export const defaultItem = {
  itemName: "",
  insurance: true,
  description: "",
  unitPrice: 0,
  quantityItem: 0,
  unitWeight: 0,
  length: 0,
  width: 0,
  height: 0,
  color: "",
};

export const FORMAT_TIME = "DD/MM/YYYY";
export const FORMAT_SHOW_TIME = "DD/MM/YYYY HH:mm";
export const FORMAT_TIME_SUBMIT = "YYYY-MM-DDTHH:mm";

const CreateOrderForm = ({ id }) => {
  const userContext = useContext(GlobalContext);
  const { userInformation, headers } = userContext;
  const orderContext = useContext(OrderContext);
  const { setKeySelected, keySelected } = orderContext;

  const [order, setOrder] = useState({
    orderDate: dayjs().format(FORMAT_TIME_SUBMIT),
    companyId: "",
    dayGet: dayjs().add(1, "day").format(FORMAT_TIME_SUBMIT),
    locationDetailGet: "",
    provinceGet: "Thành Phố Hồ Chí Minh",
    cityGet: "",
    districtGet: "",
    wardGet: "",
    locationDetailDelivery: "",
    provinceDelivery: "",
    cityDelivery: "",
    districtDelivery: "",
    wardDelivery: "",
    deliveryTo: "",
    deliveryPhone: "",
    pack: 0,
    supperMarket: 0,
    accountId: null,
    items: [],
    image: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast({ position: "top" });
  const [nextToReview, setPrevToReview] = useState(false);

  const onNextToReviewOrder = () => {
    setPrevToReview(true);
    handleCreateResponse();
  };

  const onBackOrder = () => {
    setPrevToReview(false);
  };

  const [selectedItem, setItemSelected] = useState(defaultItem);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [company, setCompany] = useState([]);

  const [orderBill, setOrderBill] = useState({});

  const [itemData, setItemData] = useState(defaultItem || {});

  const [companyData, setCompanyData] = useState(null);

  const handleItemChange = (name, value) => {
    setItemData({ ...itemData, [name]: value });
  };

  const handleItemChangeNumber = (name, value) => {
    const newNumber = parseFloat(value || "0", 10);
    if (Number.isNaN(itemData[name])) {
      return;
    }

    setItemData({ ...itemData, [name]: newNumber });
  };

  const handleTransferAddress = (companyData) => {
    if (!companyData) return;

    let address = companyData[0]?.companyLocation?.split(",").at(0)?.trim();
    let ward = companyData[0]?.companyLocation?.split(",").at(1)?.trim();
    let district = companyData[0]?.companyLocation?.split(",").at(2)?.trim();
    let province = companyData[0]?.companyLocation?.split(",").at(3)?.trim();
    handleChangeOrder("provinceGet", province);
    handleChangeOrder("cityGet", province);
    handleChangeOrder("districtGet", district);
    handleChangeOrder("wardGet", ward);
    handleChangeOrder("locationDetailGet", address);
  };

  const handleFetchData = async () => {
    if (userInformation?.role === "Company") {
      try {
        const getCompany = await axios.get(
          `/Company?accountId=${userInformation?.accounId}`,
          {
            headers,
          }
        );
        if (getCompany.status === 200) {
          let companyData = getCompany.data;
          setOrder({ ...order, companyId: companyData[0]?.companyId });
          setCompanyData(companyData[0]);
          handleTransferAddress(companyData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    try {
      const getCompany = await axios.get(`/Company`, {
        headers,
      });
      if (getCompany.status === 200) {
        const companyData = getCompany.data;
        setCompany(companyData);
      }
    } catch (err) {
      console.error(err);
    }
    if (id) {
      try {
        const getOrder = await axios.get(`/Order/order?orderId=${id}`, {
          headers,
        });

        if (getOrder.status === 200) {
          let companyData = getOrder.data;
          if (companyData.length) {
            let data = companyData[0];

            setOrder(data);
            setOrderBill({
              totalInsurance: data?.totalInsurance,
              distance: data?.distance,
              expectedDeliveryDate: data?.expectedDeliveryDate,
              deliveryPrice: data?.deliveryPrice,
              totalWeight: data?.totalWeight,
              longtitudeDelivery: data?.longtitudeDelivery,
              latitudeDelivery: data?.latitudeDelivery,
            });
            if (
              userInformation?.role === "Staff" ||
              userInformation?.role === "Stocker"
            ) {
              const getCompany = await axios.get(
                `/Company?accountId=${data?.company?.accountId}`,
                {
                  headers,
                }
              );
              if (getCompany.status === 200) {
                let companyData = getCompany.data;
                setCompanyData(companyData[0]);
              }
            }
          }
        } else {
          console.log("Can't get time share");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (name, value) => {
    setItemSelected((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleChangeNumber = (name, value) => {
    const newNumber = parseFloat(value || "0", 10);

    if (Number.isNaN(selectedItem[name])) {
      return;
    }

    setItemSelected((prevItem) => ({
      ...prevItem,
      [name]: newNumber,
    }));
  };

  const handleChangeOrder = (name, value) => {
    setOrder((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleGetCompanyInformation = async (id) => {
    try {
      const getCompany = await axios.get(`/Company?companyId=${id}`, {
        headers,
      });
      if (getCompany.status === 200) {
        let companyData = getCompany.data;
        handleTransferAddress(companyData);
        setCompanyData(companyData[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateItem = async () => {
    const {
      itemId,
      deleted,
      itemInsurance,
      itemValue,
      itemWeight,
      key,
      width,
      height,
      length,
      ...rest
    } = selectedItem;

    const updatedItems = [...order.items];
    updatedItems[selectedIndex] = {
      ...selectedItem,
      width: selectedItem.width / 100,
      height: selectedItem.height / 100,
      length: selectedItem.length / 100,
    }; // Update the item at the selected index
    setOrder({
      ...order,
      items: updatedItems,
    });

    if (keySelected === "0" && id) {
      try {
        await axios.put(
          `/Order/update-item/${selectedItem.itemId}`,
          {
            ...rest,
            orderId: order.orderId,
            width: width / 100,
            height: height / 100,
            length: length / 100,
          },
          { headers }
        );
      } catch (error) {
        toast({
          title: "Lỗi hệ thống!.",
          description: `${error.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    setItemSelected(defaultItem);
    onClose();
  };

  const handleCreateResponse = async () => {
    if (!id) {
      try {
        const OrderCreateResponse = await axios.put(
          "/Order/OrderCreateResponse",
          convertOrder(order),
          { headers }
        );
        if (OrderCreateResponse.status === 200) {
          const responseData = OrderCreateResponse.data;
          setOrderBill(responseData);
        } else {
          console.log("Cant create response");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e, onSuccess = () => {}, onError = () => {}) => {
    e.preventDefault();
    try {
      const {
        account,
        items,
        company,
        companyId,
        deliveryPrice,
        distance,
        duration,
        lattitudeDelivery,
        lattitudeGet,
        longtitudeDelivery,
        longtitudeGet,
        listPriceId,
        orderDate,
        orderId,
        quantity,
        trackingNumber,
        totalInsurance,
        totalValue,
        totalWeight,
        newNotiID,
        paymentStatus,
        image,
        price,
        dayDelivery,
        ...rest
      } = order;

      // const { expectedDeliveryDate } = orderBill;

      if (id && keySelected === "0") {
        let payloadPut = {
          ...rest,
          // dayUpdate: dayjs().format(FORMAT_TIME_SUBMIT),
          // expectedDeliveryDate,
          accountId: userInformation?.accounId,
          status: true,
        };
        const UpdateOrder = await axios.put(
          `/Order/update-order/${orderId}`,
          payloadPut,
          {
            headers,
          }
        );
        if (UpdateOrder.status === 200) {
          toast({
            title: "Cập nhật đơn hàng thành công!.",
            status: "success",
            isClosable: true,
          });

          setKeySelected("1");
        } else {
          console.log("Can't update order");
        }
      } else {
        let payloadPost = {
          ...order,
          ...orderBill,
          accountId: userInformation?.accounId,
          whoEnum: getWhoEnum(userInformation?.role),
        };

        const addOrder = await axios.post("/Order", payloadPost, { headers });
        if (addOrder.status === 200) {
          toast({
            title: "Gửi thông tin thành công!",
            status: "success",
            isClosable: true,
          });
          onSuccess(addOrder.data);
        }
      }
    } catch (err) {
      const messageError = err?.response?.data?.errors;

      toast({
        title: "Không thể tạo đơn, vui lòng kiểm tra lại !",
        description: (
          <>
            {messageError
              ? Object.keys(messageError).map((key) => (
                  <div>• {messageError[key][0]}</div>
                ))
              : `${err.message}`}
          </>
        ),
        status: messageError ? "warning" : "error",
        isClosable: true,
      });
      onError();
    }
  };

  useEffect(() => {
    if (headers) {
      handleFetchData();
    }
  }, [headers]);

  return (
    <>
      {!id && !nextToReview && (
        <ButtonUploadFile setOrder={setOrder} order={order} />
      )}

      {!nextToReview ? (
        <Box
          padding={"0 3%"}
          maxW={"1400px"}
          margin={"0 auto"}
          display={"flex"}
          justifyContent={"center"}
        >
          <ModalUpdateOrderProduct
            isOpen={isOpen}
            onClose={onClose}
            selectedItem={selectedItem}
            handleChange={handleChange}
            handleChangeNumber={handleChangeNumber}
            handleUpdateItem={handleUpdateItem}
          />
          <Stack width={"100%"}>
            <FormInfo
              id={id}
              company={company}
              companyData={companyData}
              userInformation={userInformation}
              order={order}
              handleChangeOrder={handleChangeOrder}
              handleGetCompanyInformation={handleGetCompanyInformation}
            />

            <OrderProduct
              id={id}
              itemData={itemData}
              order={order}
              setOrder={setOrder}
              setItemSelected={setItemSelected}
              setSelectedIndex={setSelectedIndex}
              handleSubmit={handleSubmit}
              onOpen={onOpen}
              orderBill={orderBill}
              onNextToReviewOrder={onNextToReviewOrder}
              setItemData={setItemData}
              handleItemChange={handleItemChange}
              handleItemChangeNumber={handleItemChangeNumber}
              handleChangeOrder={handleChangeOrder}
            />
          </Stack>
        </Box>
      ) : (
        <WrapperReview
          order={order}
          companyDataProps={companyData}
          orderBill={orderBill}
          onBackOrder={onBackOrder}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
export default CreateOrderForm;
