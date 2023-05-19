import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Textarea,
  VStack,
  FormLabel,
  Spinner,
  Text,
  IconButton,
  RadioGroup,
  Radio,
  Tooltip,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionValidation } from "@/validations/UserValidation";
import { useDatabaseContext } from "@/firebase/database";
import { BeatLoader } from "react-spinners";
import { useUserContext } from "@/firebase/auth";
import Transactions from "@/components/Transactions";
import Statistics from "@/components/Statistics";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import CountIndicator from "@/components/CountIndicator";
import { useMediaQuery } from "@chakra-ui/react";

const PlanName = () => {
  const router = useRouter();
  const [categoryValues, setCategoryValues] = useState([
    { category: "", value: "" },
  ]);
  const [modalStatus, setModalStatus] = useState(false);
  const [radioValue, setRadioValue] = useState("Income");
  const [tabIndex, setTabIndex] = useState(0);
  const [docId, setDocId] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialValues = {
    amount: 0,
    category: "",
    note: "",
  };

  const { colorMode } = useColorMode();

  const {
    addTransaction,
    getAllTransactions,
    userAction,
    userIncome,
    userExpense,
    isLoading,
    spinnerStatus,
  } = useDatabaseContext();

  const { userData } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(transactionValidation),
    defaultValues: initialValues,
  });

  useEffect(() => {
    // if (!userData) {
    //   router.replace("/");
    // }

    if (router.isReady) {
      const id = router.query.id;
      getAllTransactions(id);
      setDocId(id);
    }
  }, [userAction]);

  const incomeOptions = [
    {
      category: "Select Category",
      value: "",
    },
    {
      category: "💰Salary",
      value: "💰Salary",
    },
    {
      category: "💵Cash",
      value: "💵Cash",
    },
    {
      category: "🥇Bonus",
      value: "🥇Bonus",
    },
    {
      category: "Other",
      value: "Other",
    },
  ];

  const expenseOptions = [
    {
      category: "Select Category",
      value: "",
    },
    {
      category: "🍛Food",
      value: "🍛Food",
    },
    {
      category: "🏠Rent",
      value: "🏠Rent",
    },
    {
      category: "🚕Transport",
      value: "🚕Transport",
    },
    {
      category: "🛍️Shopping",
      value: "🛍️Shopping",
    },
    { category: "🧑‍🤝‍🧑Social Life", value: "🧑‍🤝‍🧑Social Life" },
    {
      category: "🎁Gift",
      value: "🎁Gift",
    },
    {
      category: "🎒Education",
      value: "🎒Education",
    },
    {
      category: "🧑‍⚕️Health",
      value: "🧑‍⚕️Health",
    },
    {
      category: "💇Gromming",
      value: "💇Gromming",
    },
    {
      category: "Other",
      value: "Other",
    },
  ];

  // add transaction income or expense
  const handleTransaction = (data) => {
    if (!docId) {
      return;
    }
    reset();
    if (radioValue === "Income") {
      addTransaction(
        { ...data, type: "income", time: new Date() },
        docId,
        setModalStatus
      );
    } else if (radioValue === "Expense") {
      const transactionData = {
        ...data,
        type: "expense",
        time: new Date(),
      };
      if (transactionData && docId) {
        addTransaction(transactionData, docId, setModalStatus);
      }
    }
    setCharCount(0);
    setCategoryValues(incomeOptions);
    setRadioValue("Income");
  };

  const radioTabColor = useColorModeValue(
    "rgba(0, 0, 0, 0.04)",
    "rgba(255, 255, 255, 0.08)"
  );

  return (
    <>
      <Head>
        <title>{`Overview - Savingspree`}</title>
      </Head>
      {!userData ? (
        <Center height="50vh">
          <Spinner />
        </Center>
      ) : (
        <Box
          bg={colorMode === "light" && "primary"}
          h="100svh"
          pt={5}
          overflowY={isLargerThan768 && "scroll"}
        >
          <Tabs
            variant="soft-rounded"
            colorScheme="blue"
            onChange={(index) => {
              setTabIndex(index);
            }}
          >
            <Center>
              <TabList
                bg="whiteAlpha.200"
                py={2}
                px={3}
                borderRadius={99}
                border={colorMode === "light" && "2px solid black"}
              >
                <Tab
                  border={
                    colorMode === "light" && tabIndex === 0
                      ? "2px solid black"
                      : "none"
                  }
                >
                  Transactions📃
                </Tab>
                <Tab
                  ml={3}
                  border={
                    colorMode === "light" && tabIndex === 1
                      ? "2px solid black"
                      : "none"
                  }
                >
                  Statistics📊
                </Tab>
              </TabList>
            </Center>
            <TabPanels>
              <TabPanel h="100%" px={0} mt={2}>
                {/* transactions component consists of a list of all transactions made by the user. */}
                <Transactions />

                <Modal
                  isOpen={modalStatus}
                  onClose={() => {
                    setModalStatus(false);
                    setCharCount(0);
                    setCategoryValues(incomeOptions);
                    setRadioValue("Income");
                    reset();
                  }}
                  size="md"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{""}</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(handleTransaction)}>
                      <ModalBody>
                        <VStack spacing="3">
                          <FormControl isInvalid={errors?.amount}>
                            <FormLabel>Amount</FormLabel>
                            <InputGroup>
                              <InputLeftElement
                                pointerEvents="none"
                                fontSize="1.2em"
                              >
                                <Text>₹</Text>
                              </InputLeftElement>
                              <Input
                                placeholder="Enter amount"
                                id="amount"
                                {...register("amount")}
                              />
                            </InputGroup>
                            <FormErrorMessage>
                              {errors?.amount && errors?.amount.message}
                            </FormErrorMessage>
                          </FormControl>
                          <RadioGroup
                            w="100%"
                            align="start"
                            onChange={(e) => {
                              setRadioValue(e);
                              e === "Income"
                                ? setCategoryValues(incomeOptions)
                                : setCategoryValues(expenseOptions);
                            }}
                            value={radioValue}
                          >
                            <HStack spacing={2}>
                              <Box
                                w="50%"
                                px={3}
                                py={2}
                                bg={radioTabColor}
                                borderRadius={5}
                              >
                                <Radio value="Income" colorScheme="green">
                                  Income
                                </Radio>
                              </Box>
                              <Box
                                w="50%"
                                px={3}
                                py={2}
                                bg={radioTabColor}
                                borderRadius={5}
                              >
                                <Radio value="Expense" colorScheme="red">
                                  Expense
                                </Radio>
                              </Box>
                            </HStack>
                          </RadioGroup>
                          <FormControl isInvalid={errors?.category}>
                            <Select id="category" {...register("category")}>
                              {categoryValues.map(({ category, value }) => {
                                return (
                                  <option value={value} key={value}>
                                    {category}
                                  </option>
                                );
                              })}
                            </Select>
                            <FormErrorMessage>
                              {errors?.category && errors?.category.message}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl isInvalid={errors?.note}>
                            <FormLabel>Note</FormLabel>
                            <Textarea
                              placeholder="Enter the note"
                              size="sm"
                              resize="none"
                              id="note"
                              {...register("note")}
                              onChange={(e) =>
                                setCharCount(e.target.value.length)
                              }
                              maxLength={30}
                            />
                            <CountIndicator charCount={charCount} value={30} />
                            <FormErrorMessage>
                              {errors?.note && errors?.note.message}
                            </FormErrorMessage>
                          </FormControl>
                        </VStack>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          leftIcon={<AddIcon />}
                          type="submit"
                          isLoading={isLoading}
                          spinner={<BeatLoader size={8} color="white" />}
                        >
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setModalStatus(false);
                            setCharCount(0);
                            reset();
                            setCategoryValues(incomeOptions);
                            setRadioValue("Income");
                          }}
                          ml={2}
                        >
                          cancel
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalContent>
                </Modal>
                {!isLargerThan768 ? (
                  <Box
                    pos="fixed"
                    bottom="0"
                    w={"100%"}
                    bg={colorMode === "light" ? "secondary" : "gray.600"}
                    h={10}
                    borderTop={colorMode === "light" && "2px solid black"}
                  >
                    <Center>
                      <Box
                        pos="relative"
                        bottom={7}
                        onClick={() => {
                          setModalStatus(true);
                          setCategoryValues(incomeOptions);
                        }}
                      >
                        <Tooltip hasArrow label="Add transaction">
                          <IconButton
                            colorScheme="blue"
                            aria-label="Add transaction"
                            icon={<AddIcon />}
                            borderRadius={99}
                            size="lg"
                            border={colorMode === "light" && "2px solid black"}
                          />
                        </Tooltip>
                      </Box>
                    </Center>
                  </Box>
                ) : (
                  <Box
                    boxShadow="dark-lg"
                    pos={"fixed"}
                    bottom={10}
                    right={10}
                    zIndex={9999}
                    onClick={() => {
                      setModalStatus(true);
                      setCategoryValues(incomeOptions);
                    }}
                    borderRadius={99}
                  >
                    <Tooltip hasArrow label="Add transaction">
                      <IconButton
                        colorScheme="blue"
                        aria-label="Add transaction"
                        icon={<AddIcon />}
                        borderRadius={99}
                        size="lg"
                        border={colorMode === "light" && "2px solid black"}
                      />
                    </Tooltip>
                  </Box>
                )}
              </TabPanel>
              <TabPanel>
                <Statistics />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
};

export default PlanName;
