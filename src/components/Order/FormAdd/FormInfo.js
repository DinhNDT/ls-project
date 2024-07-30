import { Box, Flex, HStack, Stack } from "@chakra-ui/react";
import { Card, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FORMAT_TIME, FORMAT_TIME_SUBMIT } from ".";
import axios from "axios";
const { Option } = Select;

export const FormInfo = ({
  id,
  company,
  companyData,
  userInformation,
  order,
  handleChangeOrder,
  handleGetCompanyInformation,
}) => {
  const isRoleCompany = userInformation?.role === "Company";

  const [form] = Form.useForm();

  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  const [provincesList2, setProvincesList2] = useState([]);
  const [districtsList2, setDistrictsList2] = useState([]);

  const [wardsList, setWardsList] = useState([]);
  const [wardsList2, setWardsList2] = useState([]);

  const apiGetPublicProvinces = async () => {
    try {
      const response = await axios.get(
        "https://esgoo.net/api-tinhthanh/1/0.htm"
      );
      setProvincesList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicProvinces2 = async () => {
    try {
      const response = await axios.get(
        "https://esgoo.net/api-tinhthanh/1/0.htm"
      );

      setProvincesList2(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicDistrict = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      setDistrictsList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicDistrict2 = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      setDistrictsList2(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard = async (districtId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );

      setWardsList(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard2 = async (districtId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );

      setWardsList2(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleProvinceChange = (provinceId) => {
    apiGetPublicDistrict(provinceId);
  };

  const handleProvinceChange2 = (provinceId) => {
    apiGetPublicDistrict2(provinceId);
  };

  const handleDistrictChange = (districtId) => {
    apiGetPublicWard(districtId);
  };

  const handleDistrictChange2 = (districtId) => {
    apiGetPublicWard2(districtId);
  };

  useEffect(() => {
    apiGetPublicProvinces();
    apiGetPublicDistrict("79");
    apiGetPublicProvinces2();
  }, []);

  useEffect(() => {
    if (id) {
      if (!order.dayGet) return;
      form.setFieldValue("dayGet", dayjs(order?.dayGet));
    }
  }, [id, order]);

  return (
    <>
      <Card type="inner" title="Thông tin Công Ty">
        <Form layout="vertical">
          <Flex justifyContent={"space-between"}>
            <Form.Item
              required
              label="Tên công ty"
              style={{
                width: "19%",
                marginBottom: "10px",
                padding: "0 0 3px",
              }}
            >
              {userInformation?.role === "Staff" && !id ? (
                <Select
                  onChange={(event) => {
                    handleChangeOrder("companyId", event);
                    handleGetCompanyInformation(event);
                  }}
                  value={order?.companyId}
                >
                  <Option value="">Chọn công ty</Option>
                  {company.map((company) => (
                    <Option key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Input
                  disabled={isRoleCompany ? true : !!id}
                  value={companyData?.companyName}
                />
              )}
            </Form.Item>{" "}
            <Form.Item
              required
              label="Mã số thuế"
              style={{ width: "19%", marginBottom: "10px" }}
            >
              <Input
                disabled={isRoleCompany ? true : !!id}
                placeholder="Nhập mã số thuế"
                value={companyData?.companyId}
              />
            </Form.Item>{" "}
            <Form.Item
              required
              label="Số điện thoại"
              style={{ width: "19%", marginBottom: "10px" }}
            >
              <Input
                disabled={isRoleCompany ? true : !!id}
                placeholder="Nhập số điện thoại"
                value={companyData?.account?.phone}
              />
            </Form.Item>{" "}
            <Form.Item
              required
              label="Email"
              style={{ width: "19%", marginBottom: "10px" }}
            >
              <Input
                disabled={isRoleCompany ? true : !!id}
                placeholder="Nhập email"
                value={companyData?.account?.email}
              />
            </Form.Item>{" "}
            <Form.Item
              required
              label="Người đại diện"
              style={{ width: "19%", marginBottom: "10px" }}
            >
              <Input
                disabled={isRoleCompany ? true : !!id}
                placeholder="Nhập người đại diện"
                value={companyData?.account?.fullName}
              />
            </Form.Item>
          </Flex>
          <Form.Item required label="Địa chỉ">
            <Input.TextArea
              disabled={isRoleCompany ? true : !!id}
              placeholder="Nhập địa chỉ"
              rows={1}
              value={companyData?.companyLocation}
            />
          </Form.Item>
        </Form>
      </Card>
      <Box height={"2%"}></Box>
      <Flex justifyContent={"space-between"} mb={"2px"}>
        <Card title="Thông tin gửi hàng" type="inner" style={{ width: "60%" }}>
          <Stack spacing={4}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ dayGet: dayjs() }}
            >
              <HStack>
                <Form.Item required label="Số điện thoại">
                  <Input
                    placeholder="Nhập số điện thoại"
                    onChange={(event) =>
                      handleChangeOrder("getPhone", event.target.value)
                    }
                    value={companyData?.account?.phone}
                    disabled={isRoleCompany ? true : !!id}
                  />
                </Form.Item>
                <Form.Item required label="Họ tên">
                  <Input
                    placeholder="Nhập họ tên"
                    onChange={(event) =>
                      handleChangeOrder("getTo", event.target.value)
                    }
                    value={companyData?.account?.fullName}
                    disabled={isRoleCompany ? true : !!id}
                  />
                </Form.Item>
              </HStack>
              <Form.Item required label="Địa chỉ">
                <HStack mb={3} mt={1}>
                  <Select
                    onChange={(event, option) => {
                      // handleChangeOrder("provinceGet", event);
                      handleChangeOrder("cityGet", event);
                      handleProvinceChange(option.key);
                    }}
                    value={order?.provinceGet}
                    style={{ width: "100%" }}
                    disabled
                  >
                    <Option value="Thành Phố Hồ Chí Minh">
                      Thành Phố Hồ Chí Minh
                    </Option>
                    {/* {provincesList
                      .filter((value) => value.id === "79")
                      .map((province) => (
                        <Option key={province.id} value={province.full_name}>
                          {province.full_name}
                        </Option>
                      ))} */}
                  </Select>
                  <Select
                    onChange={(event, option) => {
                      handleChangeOrder("districtGet", event);
                      handleDistrictChange(option.key);
                    }}
                    value={order?.districtGet}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Chọn quận/huyện</Option>
                    {districtsList.map((district) => (
                      <Option key={district.id} value={district.full_name}>
                        {district.full_name}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    onChange={(event) => handleChangeOrder("wardGet", event)}
                    value={order?.wardGet}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Chọn xã/phường</Option>
                    {wardsList.map((ward) => (
                      <Option key={ward.id} value={ward.full_name}>
                        {ward.full_name}
                      </Option>
                    ))}
                  </Select>
                </HStack>
                {/* <Form.Item required label="Địa chỉ"> */}
                <Input
                  placeholder="Nhập địa chỉ"
                  onChange={(event) =>
                    handleChangeOrder("locationDetailGet", event.target.value)
                  }
                  w={"94%"}
                  value={order?.locationDetailGet}
                />
              </Form.Item>

              <Form.Item name="dayGet" required label="Ngày gửi hàng">
                <DatePicker
                  showTime
                  value={order?.dayGet}
                  onChange={(date) => {
                    handleChangeOrder(
                      "dayGet",
                      dayjs(date).format(FORMAT_TIME_SUBMIT)
                    );
                  }}
                  format={FORMAT_TIME}
                  minDate={dayjs()}
                />
              </Form.Item>
            </Form>
          </Stack>
        </Card>
        <Box w={"3%"}></Box>
        <Card title="Thông tin nhận hàng" type="inner" style={{ width: "60%" }}>
          <Stack spacing={4}>
            <Form layout="vertical">
              <HStack>
                <Form.Item required label="Số điện thoại">
                  <Input
                    placeholder="Nhập số điện thoại"
                    onChange={(event) =>
                      handleChangeOrder("deliveryPhone", event.target.value)
                    }
                    value={order?.deliveryPhone}
                  />
                </Form.Item>
                <Form.Item required label="Họ tên">
                  <Input
                    placeholder="Nhập họ tên"
                    onChange={(event) =>
                      handleChangeOrder("deliveryTo", event.target.value)
                    }
                    value={order?.deliveryTo}
                  />
                </Form.Item>
              </HStack>
              <Form.Item required label="Địa chỉ">
                <HStack mt={1} mb={3}>
                  <Select
                    onChange={(event, option) => {
                      handleChangeOrder("provinceDelivery", event);
                      handleChangeOrder("cityDelivery", event);
                      handleProvinceChange2(option.key);
                    }}
                    value={order?.provinceDelivery}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Chọn tỉnh/thành phố</Option>
                    {provincesList2.map((province) => (
                      <Option key={province.id} value={province.full_name}>
                        {province.full_name}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    onChange={(event, option) => {
                      handleChangeOrder("districtDelivery", event);
                      handleDistrictChange2(option.key);
                    }}
                    value={order?.districtDelivery}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Chọn quận/huyện</Option>
                    {districtsList2.map((district) => (
                      <Option key={district.id} value={district.full_name}>
                        {district.full_name}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    onChange={(event) =>
                      handleChangeOrder("wardDelivery", event)
                    }
                    value={order?.wardDelivery}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Chọn xã/phường</Option>
                    {wardsList2.map((ward) => (
                      <Option key={ward.id} value={ward.full_name}>
                        {ward.full_name}
                      </Option>
                    ))}
                  </Select>
                </HStack>
                <Input
                  placeholder="Nhập địa chỉ"
                  onChange={(event) =>
                    handleChangeOrder(
                      "locationDetailDelivery",
                      event.target.value
                    )
                  }
                  w={"94%"}
                  value={order?.locationDetailDelivery}
                />
              </Form.Item>
            </Form>
          </Stack>
        </Card>
      </Flex>
    </>
  );
};
