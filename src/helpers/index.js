import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { FORMAT_TIME } from "../components/Order/FormAdd";

function formatDate(inputString) {
  if (!inputString || inputString === "0001-01-01T00:00:00") {
    return "-";
  }
  var outputString = dayjs(inputString).format(FORMAT_TIME);
  return outputString;
}

function formatMoney(number) {
  const chars = String(number).split("");
  const result = [];

  for (let i = chars.length - 1, count = 0; i >= 0; i--) {
    result.unshift(chars[i]);
    count++;
    if (count % 3 === 0 && i !== 0) {
      result.unshift(".");
    }
  }
  return result.join("");
}

function getDateNowIso() {
  let isoDateString = Date.now();
  let originalDate = new Date(isoDateString);
  originalDate.setHours(originalDate.getHours() + 7);

  let newIsoDateString = originalDate.toISOString();
  return newIsoDateString;
}

function convertOrder(order) {
  // Extracting fields
  const {
    dayGet,
    locationDetailGet,
    provinceGet,
    cityGet,
    districtGet,
    wardGet,
    locationDetailDelivery,
    provinceDelivery,
    cityDelivery,
    districtDelivery,
    wardDelivery,
    items,
    pack,
    supperMarket,
  } = order;

  // Mapping items to the desired structure
  const weightItemList = items.map(
    ({
      unitPrice,
      unitWeight,
      quantityItem,
      insurance,
      width,
      height,
      length,
    }) => ({
      unitPrice,
      unitWeight,
      quantityItem,
      insurance,
      width,
      height,
      length,
    })
  );

  const convertedOrder = {
    dayGet,
    locationDetailGet,
    provinceGet,
    cityGet,
    districtGet,
    wardGet,
    locationDetailDelivery,
    provinceDelivery,
    cityDelivery,
    districtDelivery,
    wardDelivery,
    weightItemList,
    pack,
    supperMarket,
  };

  return convertedOrder;
}

function convertISODateToDDMMYY(isoDateString) {
  let date = new Date(isoDateString);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  return `${year}-${month}-${day}`;
}

function getStatusTitle(status) {
  const statusTitles = {
    // 1: "Hàng đã về kho",
    2: "Đang đợi",
    3: "Đã duyệt",
    4: "Từ chối",
    5: "Vận chuyển",
    6: "Hoàn thành",
    7: "Trì hoãn",
    9: "Hàng đã về kho",
  };

  return statusTitles[status] || "Unknown Status";
}

function getStatusTitlePayment(status) {
  const statusTitles = {
    0: "Chưa thanh toán",
    1: "Đã thanh toán",
    2: "Thanh toán thất bại",
  };

  return statusTitles[status] || "Unknown Status";
}

function getStatusColor(status) {
  const statusTitles = {
    // 1: "purple",
    2: "gold",
    3: "green",
    4: "red",
    5: "blue",
    6: "green",
    7: "purple",
    9: "cyan",
  };

  return statusTitles[status] || "lime";
}
function getStatusColorPayment(status) {
  const statusTitles = {
    0: "geekblue",
    1: "lime",
    2: "volcano",
  };

  return statusTitles[status] || "lime";
}

function getStatusTrip(status) {
  const statusTitles = {
    1: "Đã xóa",
    2: "Hàng đã về kho",
    3: "Vận chuyển",
    4: "Hoàn thành",
    5: "Vấn đề",
    6: "Đang nhận",
  };

  return statusTitles[status] || "Unknown Status";
}

function getStatusTripColor(status) {
  const statusTitles = {
    1: "red",
    2: "magenta",
    3: "blue",
    4: "green",
    5: "volcano",
    6: "purple",
  };

  return statusTitles[status] || "Unknown Status";
}

function getWhoEnum(role) {
  const whoEnum = {
    Staff: 0,
    Company: 1,
  };

  return whoEnum[role] ?? null;
}

const exportToExcel = (data, fileName) => {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const columnWidths = Array(data[0].length).fill({ width: 25 });
  ws["!cols"] = columnWidths;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export {
  formatDate,
  formatMoney,
  getDateNowIso,
  convertOrder,
  convertISODateToDDMMYY,
  getStatusTripColor,
  getWhoEnum,
  getStatusTitlePayment,
  getStatusColorPayment,
  getStatusTitle,
  getStatusColor,
  getStatusTrip,
  exportToExcel,
};
