import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  Flex,
  Spacer,
  Heading,
  Button,
  Drawer,
  DrawerBody,
  IconButton,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  HStack,
  Text,
  VStack,
  Box,
  DrawerHeader,
  Avatar,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Image,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import ColorMode from "./ColorMode";
import { useUserContext } from "@/firebase/auth";
import { HamburgerIcon } from "@chakra-ui/icons";
import { MdSpaceDashboard } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { BeatLoader } from "react-spinners";
import { FiLogOut } from "react-icons/fi";
import { useColorMode } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userData, isLoading, userLogOut } = useUserContext();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");

  const redirectUser = () => {
    if (!userData) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  };

  const LoginAndLogoutBtn = () => {
    return (
      <>
        {!userData ? (
          <Link href="/login" onClick={onClose}>
            <Button colorScheme="blue" variant="outline">
              Login / Signup
            </Button>
          </Link>
        ) : (
          <Button
            leftIcon={<FiLogOut />}
            variant="outline"
            colorScheme="blue"
            isLoading={isLoading}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              userLogOut();
            }}
          >
            Sign Out
          </Button>
        )}
      </>
    );
  };

  const NavigationTabs = () => {
    return (
      <>
        {!userData ? (
          <Link href="/" onClick={onClose}>
            <HStack>
              <Box
                p={2}
                bg={"#bee3f8"}
                borderRadius="5"
                mt={{ base: 5, lg: 0 }}
              >
                <AiFillHome color="#3182ce" />
              </Box>
              <Text>Home</Text>
            </HStack>
          </Link>
        ) : (
          <Link href="/dashboard" onClick={onClose}>
            <HStack mt={{ base: 5, lg: 0 }}>
              <Box p={2} bg={"#bee3f8"} borderRadius="5">
                <MdSpaceDashboard color="#3182ce" />
              </Box>
              <Text>Dashboard</Text>
            </HStack>
          </Link>
        )}
      </>
    );
  };

  return (
    <Flex
      px={5}
      py={{ base: 1, lg: 2 }}
      bg={colorMode === "light" ? "secondary" : "blackAlpha.400"}
      pos="sticky"
      top={0}
      zIndex={999}
      backdropFilter="auto"
      backdropBlur="8px"
      boxShadow="base"
    >
      <HStack>
        <Image src="/logo.svg" h="20px" alt="savingspree_logo" />
        <Heading
          onClick={() => redirectUser()}
          size={{ base: "sm" }}
          cursor="pointer"
        >
          Savingspree
        </Heading>
      </HStack>
      <Spacer />

      {isLargerThan1024 ? (
        <HStack spacing={4}>
          <NavigationTabs />
          <Divider
            orientation="vertical"
            bg={colorMode === "light" && "black"}
          />
          <ColorMode />
          <Divider
            orientation="vertical"
            bg={colorMode === "light" && "black"}
          />
          <HStack>
            <Popover>
              <PopoverTrigger>
                <Avatar
                  size="sm"
                  name={userData?.displayName}
                  src={userData?.photoURL}
                  cursor="pointer"
                />
              </PopoverTrigger>
              <PopoverArrow />
              <PopoverContent w="200px">
                <PopoverBody>
                  <Text>Namaste 🙏</Text>
                  <Heading size="md">{userData?.displayName}</Heading>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <LoginAndLogoutBtn />
          </HStack>
        </HStack>
      ) : (
        <HStack spacing={1}>
          <ColorMode />
          <IconButton
            icon={<HamburgerIcon fontSize="1.5rem" />}
            onClick={onOpen}
            variant="ghost"
          />
        </HStack>
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton zIndex={99999} />
          <DrawerHeader bg={colorMode === "light" && "primary"} zIndex={9999}>
            <HStack>
              <Avatar
                size="sm"
                name={userData?.displayName}
                src={userData?.photoURL}
              />
              <Box pl={2}>
                <Text>Namaste 🙏</Text>
                <Text fontSize="sm" color="gray.500">
                  {userData?.displayName}
                </Text>
              </Box>
            </HStack>
          </DrawerHeader>
          <Divider />
          <DrawerBody bg={colorMode === "light" && "primary"}>
            <VStack align="start" spacing={5}>
              <NavigationTabs />
              <LoginAndLogoutBtn />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Navbar;
