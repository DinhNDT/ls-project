import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
  Select,
} from "@chakra-ui/react";
import { convertISODateToDDMMYY } from "../../../helpers";

function FormUpdate({ account, setAccount, readOnly }) {
  const handleChangeInput = (name, value) => {
    setAccount({ ...account, [name]: value });
  };
  const roles = [
    {
      roleId: 1,
      roleName: "Admin",
    },
    {
      roleId: 2,
      roleName: "Staff",
    },
    {
      roleId: 3,
      roleName: "Stocker",
    },
    {
      roleId: 4,
      roleName: "Company",
    },
    {
      roleId: 5,
      roleName: "Driver",
    },
  ];

  const formaDateOfBirth = convertISODateToDDMMYY(account?.dateOfBirth);
  return (
    <Stack spacing={4}>
      <FormControl id="fullName" isRequired>
        <FormLabel>Họ và tên</FormLabel>
        <Input
          isReadOnly={readOnly}
          type="text"
          value={account?.fullName}
          onChange={(e) => {
            handleChangeInput("fullName", e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="userName" isRequired>
        <FormLabel>Tên tài khoản</FormLabel>
        <Input
          isReadOnly={readOnly}
          type="text"
          value={account?.userName}
          onChange={(e) => {
            handleChangeInput("userName", e.target.value);
          }}
        />
      </FormControl>
      <HStack>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            isReadOnly={readOnly}
            type="text"
            value={account?.email}
            onChange={(e) => {
              handleChangeInput("email", e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="phone" isRequired>
          <FormLabel>Số điện thoại</FormLabel>
          <Input
            isReadOnly={readOnly}
            type="text"
            value={account?.phone}
            onChange={(e) => {
              handleChangeInput("phone", e.target.value);
            }}
          />
        </FormControl>
      </HStack>
      <FormControl id="dateOfBirth" isRequired>
        <FormLabel>Ngày sinh</FormLabel>
        <Input
          value={formaDateOfBirth}
          isReadOnly={readOnly}
          type="date"
          onChange={(e) => {
            handleChangeInput("dateOfBirth", e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="roleId" isRequired>
        <FormLabel>Vai trò</FormLabel>
        <Select
          value={account?.roleId}
          onChange={(e) => {
            handleChangeInput("roleId", e.target.value);
          }}
        >
          {roles.map((role, index) => (
            <option key={index} value={role.roleId}>
              {role.roleName}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Mật khẩu</FormLabel>
        <Input
          value={account?.password}
          isReadOnly={readOnly}
          type="password"
          onChange={(e) => {
            handleChangeInput("password", e.target.value);
          }}
        />
      </FormControl>
    </Stack>
  );
}

export default FormUpdate;
