import { Button, Image, Modal, QRCode, Table } from "antd";
import React, { useMemo, useState } from "react";
import { doDownload, formatMoney } from "../../../helpers";
import { Box, Flex, FormLabel, Text } from "@chakra-ui/react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import PriceListOrderPage from "../../../pages/price-list-order";
import "./style.css";
import { LuDownload } from "react-icons/lu";
import { URL_TRACKING_ORDER } from "../FormAdd/FormUpdateImg";

const TableSummaryRow = ({
  title,
  content,
  description,
  isHighLight = false,
}) => {
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell
        index={1}
        colSpan={3}
        align="center"
        className={isHighLight ? "bgHighlight" : ""}
      >
        <Flex justifyContent={"space-between"}>
          <Box>
            <FormLabel
              textAlign={"center"}
              margin={"unset"}
              fontSize={isHighLight ? "medium" : "small"}
            >
              {title}
            </FormLabel>
            {description && (
              <FormLabel
                // textAlign={"center"}
                margin={"unset"}
                fontSize={"smaller"}
                color={"#B2B2B2"}
              >
                {description}
              </FormLabel>
            )}
          </Box>
          <Box>{content}</Box>
        </Flex>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
};

export const TableOrder = ({
  order,
  orderBill,
  id,
  isLoadData,
  trackingNumber,
}) => {
  const orderTable = id ? order : orderBill;

  const [modal, setModal] = useState({ isOpen: false, type: 1 });

  const showModal = (type = 1) => {
    setModal({ isOpen: true, type });
  };

  const handleOk = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleCancel = () => {
    setModal({ ...modal, isOpen: false });
  };
  const columns = [
    {
      title: "",
      dataIndex: "key",
      rowScope: "row",
      align: "center",
      width: "35px",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "Dài(cm)",
      dataIndex: "length",
      key: "length",
      width: "8%",
      align: "center",
      render: (text) => <span>{parseFloat((text * 100).toFixed(2))}</span>,
    },
    {
      title: "Rộng(cm)",
      dataIndex: "width",
      key: "width",
      width: "8%",
      align: "center",
      render: (text) => <span>{parseFloat((text * 100).toFixed(2))}</span>,
    },
    {
      title: "Cao(cm)",
      dataIndex: "height",
      key: "height",
      width: "8%",
      align: "center",
      render: (text) => <span>{parseFloat((text * 100).toFixed(2))}</span>,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số lượng",
      dataIndex: "quantityItem",
      key: "quantityItem",
      width: "8%",
      align: "center",
      render: (text) => <span>{text} kiện</span>,
    },
    {
      title: "Số lượng s/p trong kiện",
      dataIndex: "quantityOfPackage",
      key: "quantityOfPackage",
      align: "center",
    },
    {
      title: "Khối lượng(kg)",
      dataIndex: "unitWeight",
      key: "unitWeight",
      width: "130px",
      align: "center",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => <span>{formatMoney(Math.ceil(text))} VNĐ</span>,
      width: "15%",
      align: "center",
    },
  ];

  const totalPriceAllItem = useMemo(
    () =>
      order?.items?.reduce((total, current) => {
        return (total +=
          Number(current.unitPrice) * Number(current.quantityItem));
      }, 0),
    [order]
  );

  const totalItem = useMemo(
    () =>
      order?.items?.reduce((total, current) => {
        return (total += Number(current.quantityItem));
      }, 0),
    [order]
  );

  const downloadCanvasQRCode = () => {
    const canvas = document
      .getElementById("qrCodeOrder")
      ?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      doDownload(url, `QRCode_MaDonHang_${id}.png`);
    }
  };

  const qrUrl = `${URL_TRACKING_ORDER}/${trackingNumber}`;

  return (
    <>
      <Table
        loading={!isLoadData}
        bordered
        pagination={false}
        columns={columns}
        dataSource={order?.items}
        style={{ marginTop: 10, marginBottom: 35 }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell
                align="center"
                index={0}
                colSpan={8}
                rowSpan={8}
                className="hideCol"
              >
                <Box>
                  {order?.image ? (
                    <>
                      <FormLabel textAlign={"left"} margin={"unset"} mb="5px">
                        Hình Ảnh:
                      </FormLabel>
                      <Image width={200} height={200} src={order?.image} />
                    </>
                  ) : null}

                  <FormLabel textAlign={"left"} margin={"unset"} mb="5px">
                    Mã QR đính kèm gói hàng:
                  </FormLabel>
                  <Box
                    id="qrCodeOrder"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                  >
                    <QRCode
                      size={180}
                      type={"canvas"}
                      value={qrUrl}
                      bgColor="#fff"
                      style={{ marginBottom: 16 }}
                    />
                  </Box>
                  <Button
                    style={{ width: "160px" }}
                    icon={<LuDownload fontSize={"19px"} />}
                    type="default"
                    onClick={downloadCanvasQRCode}
                  ></Button>
                </Box>
              </Table.Summary.Cell>
            </Table.Summary.Row>

            <TableSummaryRow
              title={"Khoảng cách vận chuyển (1):"}
              content={<>{orderTable?.distance} Km</>}
            />
            <TableSummaryRow
              title={"Tổng số lượng kiện (2):"}
              content={totalItem}
            />
            <TableSummaryRow
              title={"Tổng giá trị đơn hàng (3):"}
              content={<>{formatMoney(Math.ceil(totalPriceAllItem))} VNĐ</>}
            />
            <TableSummaryRow
              title={"Giá bảo hiểm đơn hàng (4):"}
              description={"(2% giá trị đơn hàng)"}
              content={
                <>{formatMoney(Math.ceil(orderTable?.totalInsurance))} VNĐ</>
              }
            />
            <TableSummaryRow
              title={
                <Flex gap={1} align={"center"}>
                  Tổng khối lượng (5)
                  <AiOutlineQuestionCircle
                    style={{ cursor: "pointer" }}
                    onClick={() => showModal(2)}
                  />{" "}
                  :
                </Flex>
              }
              content={<>{orderTable?.totalWeight} Kg</>}
            />
            <TableSummaryRow
              title={"Đơn giá (6):"}
              description={"(VNĐ/Kg)"}
              content={<>{formatMoney(Math.ceil(orderTable?.price))} VNĐ</>}
            />
            <TableSummaryRow
              title={
                <Flex align={"center"} gap={1}>
                  Cước Vận Chuyển
                  <AiOutlineQuestionCircle
                    fontSize={13}
                    style={{ cursor: "pointer" }}
                    onClick={() => showModal()}
                  />{" "}
                  :
                </Flex>
              }
              description={"(5) x (6) + (4)"}
              isHighLight
              content={
                <Text color={"#4096ff"} fontWeight={500} fontSize={"medium"}>
                  {formatMoney(Math.ceil(orderTable?.deliveryPrice))} VNĐ
                </Text>
              }
            />
          </Table.Summary>
        )}
        rowKey={(row) =>
          row.itemName + row.itemId + id + row.height + row.quantityItem
        }
      />
      <Modal
        title="Cước vận tải đường bộ (CPT)"
        centered
        open={modal.isOpen}
        width={modal.type === 1 ? 1000 : 800}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={handleOk}
      >
        {modal.type === 1 ? (
          <PriceListOrderPage size="small" />
        ) : (
          <Box>
            <Text fontSize={"medium"}>
              • Đối với bưu phẩm cồng kềnh, hoặc hàng nhẹ, áp dụng công thức
              tính trọng lượng khối quy đổi.
            </Text>
            <Text fontSize={"medium"}>
              • Trọng lượng quy đổi = (Dài x Rộng x Cao) (cm3) / 3000.
            </Text>
          </Box>
        )}
      </Modal>
    </>
  );
};
