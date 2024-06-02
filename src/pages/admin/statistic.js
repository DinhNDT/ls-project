import {
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { BsPerson, BsCoin } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CardBody, CardComponent, CardHeader } from "../../components/Card";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../provider";
import axios from "axios";
import { formatMoney } from "../../helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const lineOptions = {
  scales: {
    yAxes: [
      {
        id: "orders",
        type: "linear",
        position: "left",
        scaleLabel: {
          display: true,
          labelString: "Number of Orders",
        },
      },
      {
        id: "price",
        type: "linear",
        position: "right",
        scaleLabel: {
          display: true,
          labelString: "Total Order Price",
        },
      },
    ],
  },
};

const labels = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];

function StatsCard(props) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <Flex justifyContent={"space-between"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

function StatisticPage() {
  const userContext = useContext(GlobalContext);
  const { headers } = userContext;

  const [chartData, setChartData] = useState({
    labels,
    datasets: [],
  });
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState([]);

  const handleFetchData = async () => {
    try {
      const [getListOrder, getListUser] = await Promise.all([
        axios.get("/Order/order", { headers }),
        axios.get(
          "https://nhatlocphatexpress.azurewebsites.net/Accounts?roleId=4",
          {
            headers,
          }
        ),
      ]);
      if (getListOrder.status === 200) {
        let currentYear = new Date().getFullYear();
        const orderData = getListOrder.data;
        let ordersThisYear = orderData.filter((order) => {
          let orderDate = new Date(order.orderDate);
          let orderYear = orderDate.getFullYear();
          return orderYear === currentYear;
        });
        setOrder(ordersThisYear);
      }
      if (getListUser.status === 200) {
        const listPriceData = getListUser.data;
        setUser(listPriceData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (headers) handleFetchData();
  }, [headers]);

  useEffect(() => {
    let ordersByMonth = new Array(12).fill(0);
    let totalPriceByMonth = new Array(12).fill(0);

    order.forEach((order) => {
      let orderDate = new Date(order.orderDate);
      let month = orderDate.getMonth();
      ordersByMonth[month]++;
      totalPriceByMonth[month] += order.orderPrice;
    });

    setChartData({
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Số đơn hàng",
          data: ordersByMonth,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          yAxisID: "orders",
        },
        {
          label: "Số doanh thu",
          data: totalPriceByMonth,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          yAxisID: "price",
        },
      ],
    });
  }, [order]);

  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <CardComponent>
        <CardBody>
          <chakra.h1
            textAlign={"center"}
            fontSize={"4xl"}
            py={4}
            fontWeight={"bold"}
          >
            Thống kê trong năm
          </chakra.h1>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 5, lg: 8 }}
            padding="1rem 0"
          >
            <StatsCard
              title={"Khách hàng"}
              stat={user.length}
              icon={<BsPerson size={"3em"} />}
            />
            <StatsCard
              title={"Doanh thu"}
              stat={
                formatMoney(
                  Math.round(
                    order.reduce(
                      (start, item) => start + item?.deliveryPrice,
                      0
                    )
                  )
                ) + " VNĐ"
              }
              icon={<BsCoin size={"3em"} />}
            />
            <StatsCard
              title={"Đơn hàng"}
              stat={order.length}
              icon={<FiFileText size={"3em"} />}
            />
          </SimpleGrid>
        </CardBody>
      </CardComponent>

      <Box m={"3% 0"} justifyContent={"space-between"}>
        <CardComponent>
          <CardHeader p="6px 0px">
            <Text fontSize="xl" fontWeight="bold">
              Bảng thống kê đơn hàng và doanh thu
            </Text>
          </CardHeader>
          <CardBody>
            <Line data={chartData} options={lineOptions} />
          </CardBody>
        </CardComponent>
        {/* <Flex justifyContent={"space-between"} mt={"5%"}>
          <Box w={"27%"}>
            <CardComponent>
              <CardBody>
                <Pie data={pieCustomData} options={customerOptions} />
              </CardBody>
            </CardComponent>
          </Box>
          <Box w={"27%"}>
            <CardComponent>
              <CardBody>
                <Pie data={pieRevenueData} options={pieOptions} />
              </CardBody>
            </CardComponent>
          </Box>
          <Box w={"27%"}>
            <CardComponent>
              <CardBody>
                <Pie data={pieOrderData} options={orderOptions} />
              </CardBody>
            </CardComponent>
          </Box>
        </Flex> */}
      </Box>
    </Box>
  );
}

export default StatisticPage;
