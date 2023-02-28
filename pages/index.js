import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserContext } from "@/firebase/auth";
import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Image,
  List,
  ListItem,
  ListIcon,
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { userData, setUserData } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      router.push("/dashboard");
    }
  }, [userData, router]);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Savingspree</title>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="challa pavan bhaskar" />
        <meta
          property="og:title"
          content="Savingspree"
          data-react-helmet="true"
        />
        <meta
          name="keywords"
          content="money savings, savings, savingspree, money manager"
        />
        <meta
          name="description"
          content="Savingspree is a platform for you, to track, visualize & manage money."
        />
        <meta
          property="og:description"
          content="Savingspree is a platform for you, to track, visualize & manage money."
          data-react-helmet="true"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="savingspree" />
      </Head>
      {userData ? (
        <Center height="50vh">
          <Spinner />
        </Center>
      ) : (
        <>
          <Box
            pt={5}
            px={5}
            maxW={{ base: "100%", sm: "2xl", lg: "4xl", xl: "5xl" }}
            mx="auto"
          >
            <SimpleGrid
              columns={{ lg: 2 }}
              pb={{ base: 20, lg: 0 }}
              h={{ lg: "60vh" }}
              pt={{ lg: "10vh" }}
            >
              <VStack align="start" pb={{ base: "20" }}>
                <Heading as="h1" size="3xl" mb={2} fontWeight="extrabold">
                  Track. Analyze. Manage.
                </Heading>
                <Text pb={1} color={colorMode === "dark" && "gray.500"}>
                  Savingspree is a platform for you, to track, visualize &
                  manage money.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={() => router.push("/login")}
                >
                  Get Started😎
                </Button>
              </VStack>
              <Box>
                <Image src="/dashboard_pic.png" alt="dashboard" />
              </Box>
            </SimpleGrid>
            <SimpleGrid spacing={5} columns={{ md: 3 }} pb={{ lg: 15 }}>
              <Box
                border={colorMode === "light" && "2px solid black"}
                borderRadius={colorMode === "light" && 6}
              >
                <VStack
                  align="start"
                  p={5}
                  h="100%"
                  borderTopWidth={8}
                  borderTopColor={
                    colorMode === "light" ? "green.400" : "green.500"
                  }
                  borderRadius={5}
                  bg={colorMode === "light" ? "green.50" : "#1d4b30"}
                >
                  <Heading size="md">💰Track your transactions</Heading>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon
                        as={CheckCircleIcon}
                        color={
                          colorMode === "light" ? "green.400" : "green.500"
                        }
                      />
                      Track all income on your account.
                    </ListItem>
                    <ListItem>
                      <ListIcon
                        as={CheckCircleIcon}
                        color={
                          colorMode === "light" ? "green.400" : "green.500"
                        }
                      />
                      Track all expenses on your account.
                    </ListItem>
                  </List>
                </VStack>
              </Box>
              <Box
                border={colorMode === "light" && "2px solid black"}
                borderRadius={colorMode === "light" && 6}
              >
                <VStack
                  h="100%"
                  align="start"
                  p={5}
                  borderTopWidth={8}
                  borderTopColor={
                    colorMode === "light" ? "yellow.400" : "yellow.500"
                  }
                  borderRadius={5}
                  bg={colorMode === "light" ? "yellow.50" : "#5e501e"}
                >
                  <Heading size="md">🔒Secure data on cloud</Heading>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon
                        as={CheckCircleIcon}
                        color={
                          colorMode === "light" ? "yellow.400" : "yellow.500"
                        }
                      />
                      All your data is secure on firebase cloud.
                    </ListItem>
                    <ListItem>
                      <ListIcon
                        as={CheckCircleIcon}
                        color={
                          colorMode === "light" ? "yellow.400" : "yellow.500"
                        }
                      />
                      No worries of data storage.
                    </ListItem>
                  </List>
                </VStack>
              </Box>
              <Box
                border={colorMode === "light" && "2px solid black"}
                borderRadius={colorMode === "light" && 6}
              >
                <VStack
                  align="start"
                  p={5}
                  h="100%"
                  borderTopWidth={8}
                  borderTopColor="blue.400"
                  borderRadius={5}
                  bg={colorMode === "light" ? "blue.50" : "#142e44"}
                >
                  <Heading size="md">📊Visualize your transactions</Heading>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="blue.400" />
                      Different charts are provided for better tracking.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="blue.400" />
                      Visualize data using charts like line, doughnut.
                    </ListItem>
                  </List>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>
        </>
      )}
      <Footer />
    </>
  );
}
