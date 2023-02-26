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
import { useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import CountIndicator from "@/components/CountIndicator";

const PlanName = () => {
  const router = useRouter();
  const [categoryValues, setCategoryValues] = useState([
    { category: "", value: "" },
  ]);
  const [modalStatus, setModalStatus] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [docId, setDocId] = useState("");
  const [charCount, setCharCount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialValues = {
    amount: 0,
    category: "",
    note: "",
  };

  const { colorMode, toggleColorMode } = useColorMode();

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
    if (!userData) {
      router.push("/");
    }
    const id = localStorage.getItem("docId");
    if (id) {
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
    if (ModalTitle === "Income") {
      addTransaction(
        { ...data, type: "income", time: new Date() },
        docId,
        setModalStatus
      );
    } else if (ModalTitle === "Expense") {
      const transactionData = {
        ...data,
        type: "expense",
        time: new Date(),
      };
      if (transactionData && docId) {
        addTransaction(transactionData, docId, setModalStatus);
      }
    }
  };

  //Recharts
  const data = {
    datasets: [
      {
        data: [userIncome ? userIncome : 0, userExpense ? userExpense : 0],
        backgroundColor: ["#48BB78", "#F56565"],
        borderColor: ["#48BB78", "#F56565"],
      },
    ],
  };

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
        <Box bg={colorMode === "light" && "primary"} h="100svh" pt={5}>
          <Tabs
            variant="soft-rounded"
            colorScheme="blue"
            onChange={(index) => {
              setTabIndex(index);
            }}
          >
            <Center>
              <TabList>
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
                    reset();
                  }}
                  size="md"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{ModalTitle}</ModalHeader>
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
                          }}
                          ml={2}
                        >
                          cancel
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalContent>
                </Modal>
                <Box
                  bg="blackAlpha.400"
                  backdropFilter="auto"
                  backdropBlur="8px"
                  py={3}
                  px={5}
                  pos="fixed"
                  bottom="0"
                  w={"100%"}
                >
                  <HStack w={{ lg: "90%" }} mx="auto">
                    <Button
                      colorScheme="whatsapp"
                      width="50%"
                      onClick={() => {
                        setModalTitle("Income");
                        setModalStatus(true);
                        setCategoryValues(incomeOptions);
                      }}
                    >
                      Add Income🤑
                    </Button>
                    <Button
                      colorScheme="red"
                      width="50%"
                      onClick={() => {
                        setModalTitle("Expense");
                        setModalStatus(true);
                        setCategoryValues(expenseOptions);
                      }}
                    >
                      Add Expense💸
                    </Button>
                  </HStack>
                </Box>
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
