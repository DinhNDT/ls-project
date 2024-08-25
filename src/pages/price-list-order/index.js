import React from "react";
import { Table } from "antd";
import "./price-list-order.css";
import { Text } from "@chakra-ui/react";

const columns = [
  {
    title: "TT",
    dataIndex: "key",
    rowScope: "row",
    align: "center",
    width: "35px",
    render: (_, __, index) => <span>{index + 1}</span>,
  },
  {
    title: "Trọng lượng",
    dataIndex: "weight",
    key: "weight",
    width: "200px",
  },
  {
    title: "Nội tỉnh",
    dataIndex: "innerCity",
    key: "innerCity",
    width: "100px",
  },
  {
    title: "Đồng Nai, Bình Dương, Vũng Tàu và ngược lại",
    dataIndex: "hcmAndSurrounding",
    key: "hcmAndSurrounding",
    width: "190px",
  },
  {
    title: "Đến 300 km",
    dataIndex: "to300km",
    key: "to300km",
  },
  {
    title: "Trên 300 km",
    dataIndex: "over300km",
    key: "over300km",
  },
  {
    title:
      "Hà Giang, Tuyên Quang, Cao Bằng, Bắc Kạn, Lai Châu, Điện Biên, Lào Cai, Sơn La, Yên Bái, Hòa Bình",
    dataIndex: "distantAreas",
    key: "distantAreas",
  },
];

const data = [
  {
    key: "1",
    weight: "0 - 2 kg",
    innerCity: "30,000",
    hcmAndSurrounding: "30,000",
    to300km: "30,000",
    over300km: "80,000",
    distantAreas: "100,000",
  },
  {
    key: "2",
    weight: "2 - 1,000 kg",
    innerCity: "2,050",
    hcmAndSurrounding: "2,850",
    to300km: "3,750",
    over300km: "3,950",
    distantAreas: "6,550",
  },
  {
    key: "3",
    weight: "+ 1,000 kg",
    innerCity: "1,400",
    hcmAndSurrounding: "1,400",
    to300km: "3,000",
    over300km: "3,500",
    distantAreas: "6,050",
  },
  {
    key: "4",
    weight: "+ 3,000 kg",
    innerCity: "1,300",
    hcmAndSurrounding: "1,300",
    to300km: "3,000",
    over300km: "3,400",
    distantAreas: "5,500",
  },
  {
    key: "5",
    weight: "+ 5,000 kg",
    innerCity: "1,200",
    hcmAndSurrounding: "1,200",
    to300km: "3,000",
    over300km: "3,300",
    distantAreas: "5,300",
  },
  {
    key: "6",
    weight: "+ 10, 000 kg",
    innerCity: "1,000",
    hcmAndSurrounding: "1,000",
    to300km: "3,000",
    over300km: "3,200",
    distantAreas: "5,000",
  },
];

function PriceListOrderPage({ size = "middle" }) {
  return (
    <div className="price-list">
      <Table
        size={size}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2} align="center">
              <Text fontWeight={500}>Chỉ tiêu thời gian phát</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={1} align="center">
              <Text fontWeight={500} fontStyle={"italic"}>
                1-2 ngày
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={1} align="center">
              <Text fontWeight={500} fontStyle={"italic"}>
                1-2 ngày
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={1} align="center">
              <Text fontWeight={500} fontStyle={"italic"}>
                2-3 ngày
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={1} align="center">
              <Text fontWeight={500} fontStyle={"italic"}>
                4-6 ngày
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={1} align="center">
              <Text fontWeight={500} fontStyle={"italic"}>
                5-7 ngày
              </Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  );
}

export default PriceListOrderPage;
