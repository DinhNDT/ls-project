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
    5: "Đang nhận",
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

const checkCompletion = (obj) => {
  for (const key in obj) {
    if (
      key === "pack" ||
      key === "supperMarket" ||
      key === "totalInsurance" ||
      key === "distance" ||
      key === "totalWeight" ||
      key === "deliveryPrice"
    ) {
      if (obj[key] === undefined || obj[key] === null) {
        return false;
      }
    } else if (key === "accountId") {
    } else if (key === "items") {
      if (!Array.isArray(obj[key])) {
        return false;
      }
    } else {
      if (!obj[key]) {
        return false;
      }
    }
  }
  return true;
};

const fallBackImg =
  "data:image/png;base64,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";

export {
  formatDate,
  fallBackImg,
  formatMoney,
  getDateNowIso,
  convertOrder,
  convertISODateToDDMMYY,
  checkCompletion,
  getStatusTripColor,
  getWhoEnum,
  getStatusTitlePayment,
  getStatusColorPayment,
  getStatusTitle,
  getStatusColor,
  getStatusTrip,
  exportToExcel,
};
