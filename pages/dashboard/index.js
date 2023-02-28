import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from "@/firebase/auth";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormErrorMessage,
  VStack,
  Stack,
  Text,
  Card,
  CardBody,
  Flex,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverBody,
  PopoverContent,
  PopoverArrow,
  Spinner,
  Center,
  Image,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useDatabaseContext } from "@/firebase/database";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { useColorMode } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import CountIndicator from "@/components/CountIndicator";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/firebase/firebase-config";

const Dashboard = () => {
  const [allUserDetails, setAllUserDetails] = useState({});
  const [planFeildValid, setPlanFeildValid] = useState({
    status: false,
    message: "",
  });
  //this was added to close the modal on successfull submission
  const [modalStatus, setModalStatus] = useState(false);
  const [PlanNameEnteredByUser, setPlanNameEnteredByUser] = useState("");
  const [editPlanId, setEditPlanId] = useState({ status: false, id: "" });
  const { userData, setUserData } = useUserContext();
  const [charCount, setCharCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    getAllPlans,
    databaseResponseForAllPlans,
    createNewPlan,
    updatePlanName,
    deletePlanName,
    isLoading,
    userAction,
    spinnerStatus,
  } = useDatabaseContext();
  const { colorMode, toggleColorMode } = useColorMode();

  const router = useRouter();

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  const signinUserWithRedirect = async () => {
    try {
      const response = await getRedirectResult(auth);
      setUserData(response?.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSmallerThan768) {
      signinUserWithRedirect();
    }
    if (!userData) {
      router.push("/");
    }
    setAllUserDetails(userData);
    getAllPlans(userData?.uid);
  }, [userData, userAction, router]);

  const handleCreatePlan = () => {
    if (editPlanId.status === true) {
      updatePlanName(editPlanId?.id, PlanNameEnteredByUser, setModalStatus);
      setEditPlanId({ status: false, id: "" });
      return;
    }
    const planName = PlanNameEnteredByUser;
    const uid = allUserDetails.uid;
    const time = new Date();
    if (!planName) {
      setPlanFeildValid({ status: true, message: "Plan name is required." });
      return;
    } else {
      createNewPlan(planName, uid, time, setModalStatus);
    }
    setCharCount(0);
    setPlanNameEnteredByUser("");
  };

  const handleUpdatePlan = (id, planName) => {
    setModalStatus(true);
    setPlanNameEnteredByUser(planName);
    setCharCount(planName.length);
    setEditPlanId({ status: true, id: id });
  };

  const handleDeletePlan = (id) => {
    deletePlanName(id);
  };

  return (
    <>
      <Head>
        <title>Dashboard - Savingspree</title>
      </Head>
      <Box bg={colorMode === "light" && "primary"} h="100vh" pt={5}>
        <Box maxW={{ base: "100%", sm: "2xl", lg: "4xl", xl: "5xl" }} mx="auto">
          <Box
            mx={5}
            border="2px"
            borderStyle="dashed"
            borderRadius="5"
            borderColor={colorMode === "light" ? "#171923" : "#A0AEC0"}
          >
            <Button
              w="100%"
              leftIcon={<AddIcon />}
              colorScheme={colorMode === "light" ? "gray" : "blue"}
              variant="ghost"
              onClick={() => {
                setModalStatus(true);
              }}
              bg={colorMode === "light" && "secondary"}
            >
              Create budget plan💰
            </Button>
          </Box>

          {spinnerStatus ? (
            <Center height="50vh">
              <Spinner />
            </Center>
          ) : (
            <>
              {databaseResponseForAllPlans.length ? (
                <VStack px={5} mt={5}>
                  {databaseResponseForAllPlans?.map((plansData) => {
                    const { planName, uid, time, id } = plansData;
                    return (
                      <Card
                        w="100%"
                        spacing={3}
                        key={id}
                        bg={colorMode === "light" && "cardColor"}
                      >
                        <CardBody>
                          <Flex justifyContent="space-between">
                            <Box
                              width="100%"
                              onClick={() => {
                                //used local storage to store plan id so even if refresh is called all data is loaded
                                localStorage.setItem("docId", id);
                                localStorage.setItem("planName", planName);
                                router.push({
                                  pathname: `/dashboard/${id}`,
                                });
                              }}
                            >
                              <Text
                                fontSize={{ base: "lg", lg: "xl" }}
                                width={!isLargerThan768 && "200px"}
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                pt={1}
                                cursor="pointer"
                              >
                                {planName}
                              </Text>
                            </Box>
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
                                  <Stack spacing="2">
                                    <Button
                                      width="100%"
                                      colorScheme="blue"
                                      leftIcon={<FaEdit />}
                                      onClick={() => {
                                        handleUpdatePlan(id, planName);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      width="100%"
                                      leftIcon={<MdDelete />}
                                      colorScheme="red"
                                      isLoading={isLoading}
                                      spinner={
                                        <BeatLoader
                                          size={8}
                                          color={
                                            colorMode === "dark"
                                              ? "white"
                                              : "#E53E3E"
                                          }
                                        />
                                      }
                                      onClick={() => {
                                        handleDeletePlan(id);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Stack>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Flex>
                        </CardBody>
                      </Card>
                    );
                  })}
                </VStack>
              ) : (
                <Box px={5} textAlign="center">
                  <Text pt={5} color="gray.500">
                    No plans added📑
                  </Text>
                  <Image
                    src="/empty.svg"
                    h={{ md: "50vh" }}
                    w={{ md: "50vw" }}
                    mx="auto"
                    alt="no_plans_added_image"
                  />
                </Box>
              )}

              <Modal
                isOpen={modalStatus}
                onClose={() => {
                  setModalStatus(false);
                  setPlanNameEnteredByUser("");
                  setCharCount(0);
                }}
                size="md"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Enter Plan Name📈</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl isInvalid={planFeildValid.status}>
                      <Input
                        type="text"
                        maxLength={30}
                        value={PlanNameEnteredByUser}
                        onChange={(e) => {
                          setCharCount(e.target.value.length);
                          setPlanNameEnteredByUser(e.target.value);
                        }}
                      />
                      {/* indicates the length of the plan name. */}
                      <CountIndicator charCount={charCount} value={30} />
                      <FormErrorMessage>
                        {planFeildValid.message}
                      </FormErrorMessage>
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      leftIcon={<AddIcon />}
                      onClick={handleCreatePlan}
                      isLoading={isLoading}
                      spinner={<BeatLoader size={8} color="white" />}
                    >
                      Create
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setModalStatus(false);
                        setPlanNameEnteredByUser("");
                        setCharCount(0);
                      }}
                      ml={2}
                    >
                      cancel
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
