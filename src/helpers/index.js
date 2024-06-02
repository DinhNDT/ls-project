import * as XLSX from "xlsx";

function formatDate(inputString) {
  if (!inputString) return;
  var dateObj = new Date(inputString);
  var outputString = dateObj.toISOString().slice(0, 19).replace("T", " ");
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
    1: "Idle",
    2: "Waiting",
    3: "Accepted",
    4: "Cancel",
    5: "Delivering",
    6: "Completed",
    7: "Delay",
    9: "InStock",
  };

  return statusTitles[status] || "Unknown Status";
}

function getStatusTrip(status) {
  const statusTitles = {
    1: "Deleted",
    2: "Idle",
    3: "Delivering",
    4: "Completed",
    5: "Problem",
    6: "Getting",
  };

  return statusTitles[status] || "Unknown Status";
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
  getStatusTitle,
  getStatusTrip,
  exportToExcel,
};
