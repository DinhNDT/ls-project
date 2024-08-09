import { convertISODateToDDMMYY } from "../../../helpers";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
  Select,
} from "@chakra-ui/react";

function FormAdd({ account, setAccount }) {
  const handleChangeInput = (name, value) => {
    setAccount({ ...account, [name]: value });
  };

  const handleChangeNumber = (name, value) => {
    const newNumber = parseInt(value, 10);
    const reg = /^[0-9]*$/;
    if (reg.test(value) || value === "") {
      setAccount((prev) => ({ ...prev, [name]: newNumber }));
    }
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
            type="number"
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
      {account?.roleId === "5" ? (
        <>
          <FormControl id="licenseNumber" isRequired>
            <FormLabel>Giấy phép lái xe</FormLabel>
            <Input
              type="number"
              value={account?.licenseNumber}
              onChange={(e) => {
                handleChangeNumber("licenseNumber", e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="citizenId" isRequired>
            <FormLabel>Căn cước công dân</FormLabel>
            <Input
              type="number"
              value={account?.citizenId}
              onChange={(e) => {
                handleChangeNumber("citizenId", e.target.value);
              }}
            />
          </FormControl>
        </>
      ) : null}
      <FormControl id="password" isRequired>
        <FormLabel>Mật khẩu</FormLabel>
        <Input
          value={account?.password}
          type="password"
          onChange={(e) => {
            handleChangeInput("password", e.target.value);
          }}
        />
      </FormControl>
    </Stack>
  );
}

export default FormAdd;
