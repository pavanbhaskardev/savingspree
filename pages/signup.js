import React, { useState, useEffect } from "react";
import {
  Text,
  VStack,
  Input,
  Button,
  Heading,
  Center,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  Stack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import GoogleIcon from "../public/googleIcon.js";
import { useRouter } from "next/router.js";
import { useUserContext } from "@/firebase/auth.js";
import { Formik } from "formik";
import { signupValidation } from "@/validations/UserValidation.js";
import { BeatLoader } from "react-spinners";
import { useColorMode } from "@chakra-ui/react";
import Head from "next/head.js";

const signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { createNewUser, signInWithGoogle, isLoading, error, userData } =
    useUserContext();

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (userData) {
      router.push("/dashboard");
    }
  }, [userData]);

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values, errors) => {
    const { name, email, password } = values;
    createNewUser(name, email, password);
    if (error) {
      toast({
        description: error.message,
        status: "error",
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Savingspree</title>
      </Head>
      <Box bg={colorMode === "light" && "primary"} h="100vh" pt={10}>
        {userData ? (
          <Center height="50vh">
            <Spinner />
          </Center>
        ) : (
          <>
            <VStack
              p={{ base: 5, sm: 9 }}
              maxW="md"
              mx="auto"
              bg={{ base: "transparent", md: "whiteAlpha.50" }}
              boxShadow={{ base: "none", md: "md" }}
              borderRadius={{ base: "none", md: "xl" }}
            >
              <Heading size="md">Create your account</Heading>
              <HStack pb={5}>
                <Text color="gray.500">Already have an account?</Text>
                <Button
                  colorScheme="blue"
                  variant="link"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              </HStack>
              <Formik
                initialValues={initialValues}
                validationSchema={signupValidation}
                onSubmit={handleSubmit}
              >
                {(formik) => (
                  <form
                    onSubmit={formik.handleSubmit}
                    style={{ width: "100%" }}
                  >
                    <Stack textAlign="left" width="100%" pb={2}>
                      <FormControl
                        isInvalid={formik.errors.name && formik.touched.name}
                      >
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                          type="text"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                        />
                        <FormErrorMessage>
                          {formik.errors.name}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                    <Stack textAlign="left" width="100%" pb={2}>
                      <FormControl
                        isInvalid={formik.errors.email && formik.touched.email}
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          type="email"
                          value={formik.values.email}
                          name="email"
                          onChange={formik.handleChange}
                        />
                        <FormErrorMessage>
                          {formik.errors.email}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>

                    <Stack textAlign="left" width="100%" pb={2}>
                      <FormControl
                        isInvalid={
                          formik.errors.password && formik.touched.password
                        }
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup>
                          <Input
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            type={showPassword ? "text" : "password"}
                          />
                          <InputRightElement>
                            <IconButton
                              variant="link"
                              icon={
                                showPassword ? <ViewOffIcon /> : <ViewIcon />
                              }
                              onClick={() =>
                                setShowPassword((current) => !current)
                              }
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                          {formik.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                    <Button
                      w="100%"
                      mt={2}
                      colorScheme="blue"
                      type="submit"
                      isLoading={isLoading}
                      spinner={<BeatLoader size={8} color="white" />}
                    >
                      Create Account
                    </Button>
                  </form>
                )}
              </Formik>

              <Stack direction="row" width="100%" align="center" py={2}>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                  or continue with
                </Text>
                <Divider />
              </Stack>
              <Center
                _hover={{
                  bg: colorMode === "dark" ? "whiteAlpha.50" : "blackAlpha.50",
                }}
                w="100%"
                borderWidth="1px"
                borderRadius="lg"
                p={2}
                cursor="pointer"
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                <Text ml={2}>Continue with Google</Text>
              </Center>
            </VStack>
          </>
        )}
      </Box>
    </>
  );
};

export default signup;
