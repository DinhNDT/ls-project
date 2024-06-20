import { Input, Tooltip } from "antd";
import { useState } from "react";

export const InputFormatPrice = ({
  id,
  valueInput,
  handleItemChange,
  hasTooltip = false,
}) => {
  const [value, setValue] = useState(valueInput ?? "");
  const formatNumber = (value) =>
    new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(value);

  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      setValue(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  // const handleBlur = () => {
  //   let valueTemp = value;
  //   if (value.charAt(value.length - 1) === "." || value === "-") {
  //     valueTemp = value.slice(0, -1);
  //   }
  //   setValue(valueTemp.replace(/0*(\d+)/, "$1"));
  // };

  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(Number(value)) : "-"} (VNĐ)
    </span>
  ) : (
    "Nhập số tiền"
  );

  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="bottomLeft"
      overlayClassName="numeric-input"
      overlayStyle={{ zIndex: "1999" }}
    >
      <Input
        disabled={id ? true : false}
        value={valueInput}
        precision={2}
        min={0}
        type="number"
        onChange={(valueString) => {
          handleItemChange("unitPrice", valueString.target.value);
          handleChange(valueString);
        }}
        // onBlur={handleBlur}
      />
    </Tooltip>
  );
};
