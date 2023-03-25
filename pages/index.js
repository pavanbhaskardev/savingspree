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
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { Footer } from "@/components/Footer";
import { useMediaQuery } from "@chakra-ui/react";

export default function Home() {
  const { userData, setUserData } = useUserContext();
  const router = useRouter();
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

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
            maxW={{ base: "100%", sm: "2xl", lg: "4xl", xl: "6xl" }}
            mx="auto"
          >
            <SimpleGrid
              columns={{ lg: 2 }}
              pb={{ base: 20, lg: 0 }}
              h={{ lg: "25rem" }}
              pt={{ lg: "10vh" }}
            >
              <VStack align="start" pb={{ base: "20" }}>
                <Heading
                  as="h1"
                  size={{ base: "xl", lg: "2xl", xl: "3xl" }}
                  mb={2}
                  fontWeight="extrabold"
                >
                  Track. Analyze. Manage.
                </Heading>
                <Text
                  pb={{ base: 2 }}
                  color={colorMode === "dark" && "gray.500"}
                  fontSize={{ lg: "xl" }}
                  pr={{ lg: 2 }}
                >
                  Savingspree is a platform for you, to track, visualize &
                  manage money.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={() => router.push("/login")}
                  borderRadius="99"
                >
                  Get Started 😎
                </Button>
              </VStack>
              <Box>
                <Image
                  src="/dashboardPic.png"
                  alt="dashboard"
                  borderRadius={10}
                  height={{ lg: "330px" }}
                  width={"100%"}
                  objectFit="cover"
                />
              </Box>
            </SimpleGrid>
            <SimpleGrid
              spacing={5}
              columns={{ md: 3 }}
              pb={{ base: 20 }}
              pt={{ xl: 20 }}
            >
              <VStack
                align="start"
                p={5}
                h="100%"
                borderRadius={10}
                bg={colorMode === "light" ? "green.50" : "#1d4b30"}
                border={colorMode === "light" && "2px solid black"}
              >
                <Box
                  p={2}
                  fontSize="2xl"
                  mb={3}
                  borderRadius={10}
                  bg={"light" ? "green.400" : "green.500"}
                  border={colorMode === "light" && "2px solid black"}
                >
                  <Image
                    src="/transactions.png"
                    h={30}
                    alt="transactions-pic"
                    loading="lazy"
                  />
                </Box>
                <Heading size="md">Track your transactions</Heading>
                <Text>Manage all your income & expenses at one place.</Text>
              </VStack>
              <VStack
                align="start"
                p={5}
                h="100%"
                borderRadius={10}
                bg={colorMode === "light" ? "blue.50" : "#142e44"}
                border={colorMode === "light" && "2px solid black"}
              >
                <Box
                  p={2}
                  fontSize="2xl"
                  mb={3}
                  borderRadius={10}
                  bg={"blue.400"}
                  border={colorMode === "light" && "2px solid black"}
                >
                  <Image
                    src="/firebase.png"
                    h={30}
                    alt="firebase-pic"
                    loading="lazy"
                  />
                </Box>
                <Heading size="md">Secure data on cloud</Heading>
                <Text>
                  All your data is secure on firebase cloud. No worries of data
                  storage.
                </Text>
              </VStack>
              <VStack
                align="start"
                p={5}
                h="100%"
                borderRadius={10}
                bg={colorMode === "light" ? "yellow.50" : "#5e501e"}
                border={colorMode === "light" && "2px solid black"}
              >
                <Box
                  p={2}
                  fontSize="2xl"
                  mb={3}
                  borderRadius={10}
                  bg={colorMode === "light" ? "yellow.400" : "yellow.500"}
                  border={colorMode === "light" && "2px solid black"}
                >
                  <Image
                    src="/bar-chart.png"
                    h={30}
                    alt="bar-chart-pic"
                    loading="lazy"
                  />
                </Box>
                <Heading size="md">Visualize your transactions</Heading>
                <Text>Different charts are provided for better tracking.</Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </>
      )}
      <Footer />
    </>
  );
}
