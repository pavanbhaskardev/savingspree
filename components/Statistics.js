import React from "react";
import { useDatabaseContext } from "@/firebase/database";
import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { Card, Title, LineChart, BarList } from "@tremor/react";

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

  //new tremor line chart
  const myNewData = expensesList?.map((cost, index) => {
    return {
      date: expensesDateList[index],
      cost: cost,
    };
  });

  //new tremor barlist chart
  const expensesBarListData = donutExpensesAmount?.map((amount, index) => {
    return {
      value: amount,
      icon: function () {
        return <Text color={"#f43f5e"}>{donutExpensesCategory[index]}</Text>;
      },
    };
  });
  //sorting expense list into decending order
  expensesBarListData?.sort((a, b) => {
    return b.value - a.value;
  });

  //new tremor barlist chart for income
  const incomeBarListData = donutIncomeAmount?.map((amount, index) => {
    return {
      value: amount,
      icon: function () {
        return <Text color={"green.600"}>{donutIncomeCategory[index]}</Text>;
      },
    };
  });
  //sorting income list into decending order
  incomeBarListData?.sort((a, b) => {
    return b.value - a.value;
  });

  const currencyFormmater = (amount) => {
    return `${new Intl.NumberFormat("hi-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  return (
    <Box h="100vh" pt={6}>
      <SimpleGrid
        columns={{ base: 1, lg: 1 }}
        spacing={3}
        maxW={{ base: "100%", md: "2xl", lg: "4xl", xl: "5xl" }}
        mx="auto"
        px={{ base: 3 }}
        pb={10}
      >
        {donutExpensesAmount.length ? (
          <Card className="bg-inherit">
            <Title color={colorMode === "dark" && "white"}>
              Expenses Graph
            </Title>
            <LineChart
              className="mt-6 "
              data={myNewData}
              index="date"
              categories={["cost"]}
              colors={["rose"]}
              valueFormatter={currencyFormmater}
              yAxisWidth={40}
              showAnimation={true}
            />
          </Card>
        ) : null}

        {donutExpensesAmount.length ? (
          <Card className="bg-inherit">
            <Title color={colorMode === "dark" && "white"}>All Expenses</Title>
            <BarList
              data={expensesBarListData}
              valueFormatter={currencyFormmater}
              className="mt-2"
              color="red"
            />
          </Card>
        ) : null}

        {donutIncomeAmount.length ? (
          <Card className="bg-inherit">
            <Title color={colorMode === "dark" && "white"}>All Income</Title>
            <BarList
              data={incomeBarListData}
              valueFormatter={currencyFormmater}
              className="mt-2"
              color="emerald"
            />
          </Card>
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
