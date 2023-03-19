import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { Line } from "react-chartjs-2";
import { useDatabaseContext } from "@/firebase/database";
import { SimpleGrid, Box, Heading, Text } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Statistics = () => {
  const {
    expensesList,
    expensesDateList,
    donutExpensesAmount,
    donutExpensesCategory,
    donutIncomeAmount,
    donutIncomeCategory,
  } = useDatabaseContext();

  const { colorMode, toggleColorMode } = useColorMode();

  const lineChartData = {
    labels: expensesDateList,
    datasets: [
      {
        label: "Amount",
        data: expensesList,
        backgroundColor: "transparent",
        borderColor: "#F56565",
        borderWidth: 3,
        pointBorderColor: "transparent",
        tension: 0.3,
      },
    ],
  };

  const lineChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  //Donut Chart for Expenses
  const expenesesChartData = {
    labels: donutExpensesCategory,
    datasets: [
      {
        data: donutExpensesAmount ? donutExpensesAmount : 0,
        backgroundColor: [
          "#F56565",
          "#ED8936",
          "#ECC94B",
          "#BAD7E9",
          "#EAF6F6",
          "#FAC213",
          "#B9C0D5",
          "#E9E2D0",
          "#FF87B2",
          "#FEB139",
        ],
        borderWidth: 0,
        // cutout: "60%",
      },
    ],
  };

  const expenesesChartOptions = {
    // plugins: {
    //   legend: {
    //     display: false,
    //   },
    // },
  };

  //Donut Chart for income
  const incomeChartData = {
    labels: donutIncomeCategory,
    datasets: [
      {
        data: donutIncomeAmount ? donutIncomeAmount : 0,
        backgroundColor: ["#4299e1", "#ebf8ff", "#90cdf4", "#3182ce"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Box h="100vh">
      <SimpleGrid
        columns={{ base: 1, lg: 3 }}
        spacing={3}
        maxW={{ base: "100%", md: "2xl", lg: "4xl", xl: "5xl" }}
        mx="auto"
        px={{ base: 3 }}
      >
        {donutExpensesAmount.length ? (
          <>
            <Box
              bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
              borderRadius="10"
              p={2}
              border={colorMode === "light" && "2px solid black"}
            >
              <Heading size={{ base: "xs", md: "sm" }} ml={2} mb={3}>
                Expenses Graph
              </Heading>
              <Line data={lineChartData} options={lineChartOptions} />
            </Box>
            <Box
              bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
              borderRadius="10"
              p={2}
              border={colorMode === "light" && "2px solid black"}
            >
              <Heading size={{ base: "xs", md: "sm" }} ml={2} mb={3}>
                All Expenses
              </Heading>
              <Box w="240px" mx="auto">
                <Doughnut
                  data={expenesesChartData}
                  options={expenesesChartOptions}
                />
              </Box>
            </Box>
          </>
        ) : null}

        {donutIncomeAmount.length ? (
          <Box
            bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
            borderRadius="10"
            p={2}
            border={colorMode === "light" && "2px solid black"}
          >
            <Heading size={{ base: "xs", md: "sm" }} ml={2} mb={3}>
              All Income
            </Heading>
            <Box w="240px" mx="auto">
              <Doughnut data={incomeChartData} />
            </Box>
          </Box>
        ) : null}
      </SimpleGrid>

      {!donutIncomeAmount.length && !donutExpensesAmount.length && (
        <Text textAlign="center" color="gray.500" mt={5}>
          Add Income or Expenses🙃
        </Text>
      )}
    </Box>
  );
};

export default Statistics;
