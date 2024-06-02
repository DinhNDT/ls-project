import React from "react";
import { Table } from "antd";
import "./price-list-order.css";

const columns = [
  {
    title: "Trọng lượng",
    dataIndex: "weight",
    key: "weight",
  },
  {
    title: "Nội tỉnh",
    dataIndex: "innerCity",
    key: "innerCity",
  },
  {
    title: "Hồ Chí Minh, Đồng Nai, Bình Dương, Vũng Tàu và ngược lại",
    dataIndex: "hcmAndSurrounding",
    key: "hcmAndSurrounding",
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
      "Hà Giang, Tuyên Quang, Cao Bằng, Bắc Kạn, Lai Châu, Điện Biên, Lào Cai, Sơn La, Yên Bái, Hòa Bình, Kon Tum, Gia Lai, Lâm Đồng",
    dataIndex: "distantAreas",
    key: "distantAreas",
  },
];

const data = [
  {
    key: "1",
    weight: "0 - 2 kg",
    innerCity: "30.000",
    hcmAndSurrounding: "30.000",
    to300km: "30.000",
    over300km: "80.000",
    distantAreas: "100.000",
  },
  {
    key: "2",
    weight: "2 - 1,000 kg",
    innerCity: "2.050",
    hcmAndSurrounding: "2.850",
    to300km: "3.750",
    over300km: "3.950",
    distantAreas: "6.550",
  },
  // Thêm các dòng dữ liệu khác tương tự...
  {
    key: "7",
    weight: "+ 10, 000 kg",
    innerCity: "1.000",
    hcmAndSurrounding: "1.000",
    to300km: "3.000",
    over300km: "3.200",
    distantAreas: "5.000",
  },
];

function PriceListOrderPage() {
  return (
    <div className="price-list">
      <Table columns={columns} dataSource={data} bordered pagination={false} />
    </div>
  );
}

export default PriceListOrderPage;
