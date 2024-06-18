import { FormControl, FormLabel } from "@chakra-ui/react";
import { Form, Input } from "antd";
import React from "react";

export const FormUserInfo = () => {
  return (
    <>
      <FormControl isRequired>
        <FormLabel>Họ Và Tên</FormLabel>
        <Form.Item
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Tên Người Đại Diện",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Căn Cước Công Dân</FormLabel>
        <Form.Item
          name="citizenId"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Căn Cước Công Dân",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Số Điện Thoại</FormLabel>
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Số Điện Thoại",
            },
          ]}
        >
          <Input maxLength={10} />
        </Form.Item>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Tên Email",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </FormControl>
    </>
  );
};
