import { Button } from "@chakra-ui/react";
import React, { useRef } from "react";
import { TbFileImport } from "react-icons/tb";
import * as XLSX from "xlsx";

export const ButtonUploadFile = ({ order, setOrder }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const convertedData = parsedData.slice(1).map((row) => ({
        itemName: row[0],
        insurance: row[1],
        description: row[2],
        unitPrice: row[3],
        quantityItem: row[4],
        unitWeight: row[5],
        length: row[6],
        width: row[7],
        height: row[8],
        color: row[9],
      }));
      setOrder({ ...order, items: [...order?.items, ...convertedData] });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <Button
        position="fixed"
        bottom={"50px"}
        right={"50px"}
        bgColor={"#0BC5EA"}
        zIndex={"100"}
        borderRadius={"50%"}
        w={"50px"}
        h={"50px"}
        onClick={handleButtonClick}
      >
        <TbFileImport style={{ fontSize: "24px" }} />
      </Button>
    </>
  );
};
