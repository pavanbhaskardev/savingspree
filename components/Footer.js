import {
  Image,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { useColorMode } from "@chakra-ui/react";

export const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Stack
      px={{ base: 5, md: 10, lg: 20, xl: 40 }}
      py={{ base: 3 }}
      bg={colorMode === "light" ? "secondary" : "blackAlpha.300"}
      borderTop={colorMode === "light" && "2px solid black"}
pos="fixed"
bottom={0}
w="100%"
    >
      <HStack w="100%">
        <HStack>
          <Image src="/logo.svg" h="20px" alt="savingspree_logo" />
          <Heading size="sm">Savingspree</Heading>
          <Tag colorScheme="blue" size="sm">
            Beta
          </Tag>
        </HStack>
        <Spacer />
        <IconButton
          variant="ghost"
          as="a"
          href="https://github.com/pavanbhaskardev/savingspree"
          target="_blank"
          aria-label="GitHub"
          icon={<FaGithub fontSize="1.25rem" />}
        />
      </HStack>
      <Text fontSize="sm" color={colorMode === "dark" && "gray.500"}>
        &copy; {new Date().getFullYear()} Savingspree, All rights reserved.
      </Text>
    </Stack>
  );
};
