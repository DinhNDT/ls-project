import { FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { Form, Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const { Option } = Select;

export const FormCompanyInfo = () => {
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);

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

  const handleProvinceChange = (provinceId) => {
    apiGetPublicDistrict(provinceId);
  };

  const handleDistrictChange = (id) => {
    apiGetPublicWard(id);
  };

  useEffect(() => {
    apiGetPublicProvinces();
  }, []);

  return (
    <div spacing={1}>
      <FormControl isRequired>
        <FormLabel>Tên Tài Khoản</FormLabel>
        <Form.Item
          name="userName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên tài khoản",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Mật Khẩu</FormLabel>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Nhập Lại Mật Khẩu</FormLabel>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Vui lòng nhập lại mật khẩu!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khậu nhập không khớp"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Tên Công Ty</FormLabel>
        <Form.Item
          name="companyName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên công ty",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Mã Số Thuế</FormLabel>
        <Form.Item
          name="companyId"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Mã Số Thuế",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </FormControl>
      <HStack>
        <FormControl isRequired>
          <FormLabel>Tỉnh/Thành</FormLabel>
          <Form.Item
            name="province"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn Tỉnh/Thành",
              },
            ]}
          >
            <Select
              onChange={(_, option) => {
                handleProvinceChange(option.key);
              }}
              placeholder="Chọn Tỉnh/thành"
            >
              {provincesList
                .filter((value) => value.id === "79")
                .map((province) => (
                  <option key={province.id} value={province.full_name}>
                    {province.full_name}
                  </option>
                ))}
            </Select>
          </Form.Item>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Quận/Huyện</FormLabel>
          <Form.Item
            name="district"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn Quận/Huyện",
              },
            ]}
          >
            <Select
              onChange={(_, option) => {
                handleDistrictChange(option.key);
              }}
              placeholder="Chọn Quận/Huyện"
            >
              {districtsList.map((district) => (
                <Option key={district.id} value={district.full_name}>
                  {district.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Xã/Phường</FormLabel>
          <Form.Item
            name="ward"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn Xã/Phường",
              },
            ]}
          >
            <Select placeholder="Chọn Xã/Phường">
              {wardsList.map((ward) => (
                <Option key={ward.id} value={ward.full_name}>
                  {ward.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </FormControl>
      </HStack>
      <FormControl isRequired>
        <FormLabel>Địa Chỉ</FormLabel>
        <Form.Item
          name="address"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Địa Chỉ",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </FormControl>
    </div>
  );
};
