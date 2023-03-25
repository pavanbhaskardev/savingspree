import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  SimpleGrid,
  Flex,
  Card,
  Heading,
  Text,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverBody,
  PopoverContent,
  PopoverArrow,
  Skeleton,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { useDatabaseContext } from "@/firebase/database";
import moment from "moment/moment";
import { useColorMode } from "@chakra-ui/react";

//Recharts
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { BeatLoader } from "react-spinners";
import { useMediaQuery } from "@chakra-ui/react";
import CardSkeleton from "./CardSkeleton";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

ChartJS.register(ArcElement, Tooltip, Legend);

const Transactions = () => {
  const [docId, setDocId] = useState("");
  const [planName, setPlanName] = useState("");

  const {
    getAllTransactions,
    userAction,
    databaseResponseForAllTransactions,
    userIncome,
    userExpense,
    userTotal,
    isLoading,
    deleteTransaction,
    spinnerStatus,
  } = useDatabaseContext();

  const { colorMode, toggleColorMode } = useColorMode();

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const id = localStorage.getItem("docId");
    const planName = localStorage.getItem("planName");
    if (id) {
      setDocId(id);
      getAllTransactions(id);
      setPlanName(planName);
    }
  }, [userAction]);

  const handleDeleteTransaction = (id) => {
    deleteTransaction(docId, id);
  };

  //Recharts

  const data = {
    datasets: [
      {
        data: [
          userIncome ? userIncome - userExpense : 0,
          userExpense ? userExpense : 0,
        ],
        backgroundColor: ["#48BB78", "#F56565"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  //format currency
  const currencyFormmater = (amount) => {
    let formattedCurrency = new Intl.NumberFormat("hi-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
    return formattedCurrency;
  };

  // checks if user total amount is positive or negative
  const useTotalValue = userTotal.toString().slice(0, 1) === "-";

  return (
    <Box bg={colorMode === "light" && "primary"}>
      <Box maxW={{ base: "100%", sm: "2xl", lg: "4xl", xl: "5xl" }} mx="auto">
        {/* income expense total overview */}
        <Heading px={{ base: 5 }} size={{ base: "sm", lg: "md" }} mb={5}>
          {planName}
        </Heading>
        <SimpleGrid column={1} mx={5} spacing={2} mb={5}>
          <StatGroup>
            <HStack spacing={2} w={"100%"}>
              <HStack
                bg={colorMode === "light" ? "statColor1" : "blackAlpha.300"}
                p={{ base: 3, lg: 5 }}
                borderRadius={10}
                border={colorMode === "light" && "2px solid black"}
                w={"50%"}
              >
                <Stat size="xs">
                  <StatLabel>
                    <Heading size={{ base: "xs", md: "sm" }}>Income</Heading>
                  </StatLabel>
                  {spinnerStatus ? (
                    <Skeleton height="20px" mt={1} />
                  ) : (
                    <StatNumber
                      color={colorMode === "light" ? "#2F855A" : "green.400"}
                      fontSize={{ md: "28px", lg: "32px" }}
                    >
                      {userIncome ? currencyFormmater(userIncome) : 0}
                    </StatNumber>
                  )}
                </Stat>
                <Box
                  p={2}
                  borderRadius={10}
                  bg={colorMode === "light" ? "green.200" : "whiteAlpha.200"}
                >
                  <ArrowDownIcon
                    boxSize={{ base: 5, lg: 8 }}
                    color={colorMode === "light" ? "green.500" : "green.400"}
                  />
                </Box>
              </HStack>

              <HStack
                bg={colorMode === "light" ? "statColor2" : "blackAlpha.300"}
                p={{ base: 3, lg: 5 }}
                borderRadius={10}
                border={colorMode === "light" && "2px solid black"}
                w={"50%"}
              >
                <Stat size="xs" w={"50%"}>
                  <StatLabel>
                    <Heading size={{ base: "xs", md: "sm" }}>Expenses</Heading>
                  </StatLabel>
                  {spinnerStatus ? (
                    <Skeleton height="20px" mt={1} />
                  ) : (
                    <StatNumber
                      color={colorMode === "light" ? "red.500" : "red.400"}
                      fontSize={{ md: "28px", lg: "32px" }}
                    >
                      {userExpense ? currencyFormmater(userExpense) : 0}
                    </StatNumber>
                  )}
                </Stat>
                <Box
                  p={2}
                  borderRadius={10}
                  bg={colorMode === "light" ? "red.200" : "whiteAlpha.200"}
                >
                  <ArrowUpIcon
                    boxSize={{ base: 5, lg: 8 }}
                    color={colorMode === "light" ? "red.500" : "red.400"}
                  />
                </Box>
              </HStack>
            </HStack>
          </StatGroup>
          <Stat
            bg={colorMode === "light" ? "statColor3" : "blackAlpha.300"}
            p={{ base: 3, lg: 5 }}
            borderRadius={10}
            border={colorMode === "light" && "2px solid black"}
          >
            <Flex justifyContent="space-between" align="center">
              <Box>
                <StatLabel>
                  <Heading size={{ base: "xs", md: "sm" }}>
                    Available Balance
                  </Heading>
                </StatLabel>
                {spinnerStatus ? (
                  <Skeleton height="20px" mt={1} />
                ) : (
                  <StatNumber
                    color={
                      colorMode === "light"
                        ? useTotalValue
                          ? "red.500"
                          : "yellow.600"
                        : useTotalValue
                        ? "red.500"
                        : "blue.400"
                    }
                    fontSize={{ md: "28px", lg: "32px" }}
                  >
                    {userTotal ? currencyFormmater(userTotal) : 0}
                  </StatNumber>
                )}
              </Box>
              <Box w={{ base: "65px", md: "90px", lg: "100px" }} h="auto">
                <Doughnut data={data} options={options} />
              </Box>
            </Flex>
          </Stat>
        </SimpleGrid>

        {/* all transactions */}
        {spinnerStatus ? (
          <>
            <Stack spacing={3} mx={5}>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </Stack>
          </>
        ) : (
          <Box pb={59} h={"100%"}>
            {databaseResponseForAllTransactions?.map((transaction) => {
              const { amount, category, note, id, time, type } = transaction;
              const createdOn = time?.seconds * 1000;
              return (
                <Card
                  mx={5}
                  px={{ base: 3, md: 5 }}
                  mb={2}
                  key={id}
                  borderRadius={10}
                >
                  <Flex
                    justifyContent="space-between"
                    align="center"
                    h={["80px"]}
                  >
                    <Box>
                      <Flex>
                        <Heading
                          fontSize={{ base: "12px", sm: "14px", lg: "16px" }}
                          mr={2}
                        >
                          {category}
                        </Heading>
                        <Text
                          fontSize={{ base: "10px", sm: "12px", lg: "13px" }}
                          color="gray.500"
                        >
                          {moment(createdOn).format("MMM Do YY")}
                        </Text>
                      </Flex>
                      <Text
                        fontSize={{ base: "12px", sm: "13px", lg: "14px" }}
                        width={!isLargerThan768 && "150px"}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {note}
                      </Text>
                    </Box>
                    <Flex align="center">
                      <Heading
                        mr={2}
                        fontSize={{ base: "15px", md: "17px", lg: "18px" }}
                        color={
                          type === "income"
                            ? colorMode === "light"
                              ? "green.600"
                              : "green.400"
                            : colorMode === "light"
                            ? "red.500"
                            : "red.400"
                        }
                      >
                        {currencyFormmater(amount)}
                      </Heading>
                      <Popover>
                        <PopoverTrigger>
                          <IconButton
                            icon={<BsThreeDots />}
                            borderRadius="9999"
                          />
                        </PopoverTrigger>
                        <PopoverContent w="200px">
                          <PopoverArrow />
                          <PopoverBody>
                            <Button
                              width="100%"
                              leftIcon={<MdDelete />}
                              colorScheme="red"
                              isLoading={isLoading}
                              spinner={<BeatLoader size={8} color="white" />}
                              onClick={() => {
                                handleDeleteTransaction(id);
                              }}
                            >
                              Delete
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Transactions;
