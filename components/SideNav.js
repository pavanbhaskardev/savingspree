import {
  Heading,
  VStack,
  HStack,
  Image,
  Text,
  Box,
  Flex,
  Avatar,
  Spacer,
  Switch,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RxDashboard } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { useUserContext } from "@/firebase/auth";
import ColorMode from "./ColorMode";
import { useColorMode } from "@chakra-ui/react";

const SideNav = () => {
  const router = useRouter();
  const { userData, userLogOut } = useUserContext();
  const [allPlansTab, setAllPlansTab] = useState();
  const { colorMode, toggleColorMode } = useColorMode();

  console.log("photo", userData?.photoURL);

  useEffect(() => {
    setAllPlansTab(
      router.pathname.includes("/dashboard") &&
        !router.pathname.includes("/dashboard/[id]")
    );
  }, [router.pathname]);

  return (
    <VStack
      w={400}
      bg={colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.100"}
      align={"start"}
    >
      <Box px={5} w={"100%"}>
        <HStack
          onClick={() => router.push("/dashboard")}
          style={{ cursor: "pointer" }}
          pt={5}
        >
          <Image src="/logo.svg" h="20px" alt="savingspree_logo" />
          <Heading size={{ base: "sm" }}>Savingspree</Heading>
        </HStack>

        <VStack h={"90vh"}>
          <Box pt={5} align={"start"} w={"100%"}>
            <Text fontSize={"sm"} color="gray.500">
              Dashboard
            </Text>
            <Flex
              alignItems={"center"}
              gap={2}
              px={3}
              borderRadius={10}
              py={2}
              mt={2}
              bgColor={allPlansTab && "#4299e1"}
              w={"100%"}
              _hover={{ bgColor: "#3182ce" }}
              cursor={"pointer"}
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              <RxDashboard color={colorMode === "light" && "black"} />
              <Text fontSize={"sm"} color={colorMode === "light" && "black"}>
                All Plans
              </Text>
            </Flex>
          </Box>
          <Spacer />

          <HStack align={"center"} w={"100%"} pb={2}>
            <Text>Dark Mode</Text>
            <ColorMode />
          </HStack>

          <Flex
            align={"center"}
            py={2}
            px={3}
            bg={colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.100"}
            borderRadius={10}
            justifyContent={"space-between"}
            w={"100%"}
          >
            <Flex align={"center"}>
              <Avatar
                size={"sm"}
                name={userData?.displayName}
                src={userData?.photoURL}
              />
              <VStack align={"start"} pl={3}>
                <Text>{userData?.displayName}</Text>
                <p style={{ fontSize: "0.7rem", margin: 0, color: "#718096" }}>
                  {userData?.email}
                </p>
              </VStack>
            </Flex>
            <FiLogOut
              onClick={userLogOut}
              cursor="pointer"
              className="exit-button"
            />
          </Flex>
        </VStack>
      </Box>
    </VStack>
  );
};

export default SideNav;
