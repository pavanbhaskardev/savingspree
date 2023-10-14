import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
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
  Stack,
  HStack,
  Divider,
  Checkbox,
  Spacer,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from "@chakra-ui/icons";
import GoogleIcon from "../public/googleIcon.js";
import { useUserContext } from "@/firebase/auth.js";
import { Formik } from "formik";
import { loginValidation } from "@/validations/UserValidation.js";
import { BeatLoader } from "react-spinners";
import { useColorMode } from "@chakra-ui/react";
import Head from "next/head.js";
import { getRedirectResult } from "firebase/auth";
import { useMediaQuery } from "@chakra-ui/react";
import { auth } from "@/firebase/firebase-config.js";

const Login = () => {
  const emailRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [forgetPasswordButton, setForgotPasswordButton] = useState(false);
  const [resetPasswordStatus, setResetPasswordStatus] = useState({
    status: false,
    message: "",
  });

  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  const {
    userData,
    signInWithGoogle,
    userLogin,
    forgetPassword,
    isLoading,
    error,
    errorStatus,
    setErrorStatus,
    successStatus,
    setSuccessStatus,
    setUserData,
  } = useUserContext();

  useEffect(() => {
    if (isSmallerThan768) {
      getRedirectResult(auth)
        .then((response) => {
          if (response?.user) {
            setUserData(response?.user);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (userData) {
      router.replace("/dashboard");
    }
  }, [userData]);

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleForgotPassword = () => {
    const email = emailRef.current.value;
    if (!email) {
      setResetPasswordStatus({ status: true, message: "Email is required" });
      return;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setResetPasswordStatus({
        ...resetPasswordStatus,
        status: false,
      });
      forgetPassword(email);
    } else {
      setResetPasswordStatus({
        status: true,
        message: "Enter valid email address",
      });
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values) => {
    const { email, password } = values;
    userLogin(email, password);
  };

  return (
    <>
      <Head>
        <title>Login - Savingspree</title>
      </Head>
      <Box bg={colorMode === "light" && "primary"} h="100vh" pt={10}>
        {userData ? (
          <Center height="50vh">
            <Spinner />
          </Center>
        ) : (
          <>
            {errorStatus && (
              <Center mb={3} px={5}>
                <Alert status="error" variant="left-accent" maxW="md">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                  <Spacer />
                  <CloseButton onClick={() => setErrorStatus(false)} />
                </Alert>
              </Center>
            )}

            {successStatus && (
              <Center mb={3} px={5}>
                <Alert status="success" variant="left-accent" maxW="md">
                  <AlertIcon />
                  <AlertDescription>
                    Password reset link was send to your email!
                  </AlertDescription>
                  <Spacer />
                  <CloseButton onClick={() => setErrorStatus(false)} />
                </Alert>
              </Center>
            )}

            {!forgetPasswordButton ? (
              <VStack
                p={{ base: 5, sm: 9 }}
                maxW="md"
                mx="auto"
                bg={{ base: "transparent", md: "whiteAlpha.50" }}
                boxShadow={{ base: "none", md: "md" }}
                borderRadius={{ base: "none", md: "xl" }}
              >
                <Heading size="md">Log in to your account</Heading>
                <HStack pb={5}>
                  <Text color="gray.500">{"Don't have an account?"}</Text>
                  <Button
                    colorScheme="blue"
                    variant="link"
                    onClick={() => router.push("/signup")}
                  >
                    Sign up
                  </Button>
                </HStack>
                <Formik
                  initialValues={initialValues}
                  validationSchema={loginValidation}
                  onSubmit={handleSubmit}
                >
                  {(formik) => (
                    <form
                      onSubmit={formik.handleSubmit}
                      style={{ width: "100%" }}
                    >
                      <Stack textAlign="left" width="100%" pb={2}>
                        <FormControl
                          isInvalid={
                            formik.errors.email && formik.touched.email
                          }
                        >
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <Input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                          />
                          <FormErrorMessage>
                            {formik.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      </Stack>
                      <Stack textAlign="left" width="100%">
                        <FormControl
                          isInvalid={
                            formik.errors.password && formik.touched.password
                          }
                        >
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <InputGroup>
                            <Input
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              type={showPassword ? "text" : "password"}
                              name="password"
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
                      <HStack width="100%" py={5}>
                        <Checkbox defaultChecked colorScheme="blue">
                          <Text fontSize="sm">Remember me</Text>
                        </Checkbox>
                        <Spacer />
                        <Button
                          size="sm"
                          variant="link"
                          colorScheme="blue"
                          onClick={() => {
                            setForgotPasswordButton((current) => !current);
                            //removing alerts when the button is clicked
                            setErrorStatus(false);
                            setSuccessStatus(false);
                          }}
                        >
                          Forgot Password?
                        </Button>
                      </HStack>
                      <Button
                        w="100%"
                        colorScheme="blue"
                        type="submit"
                        isLoading={isLoading}
                        spinner={<BeatLoader size={8} color="white" />}
                      >
                        Sign in
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
                    bg:
                      colorMode === "dark" ? "whiteAlpha.50" : "blackAlpha.50",
                  }}
                  width="100%"
                  borderWidth="1px"
                  borderRadius="lg"
                  p={2}
                  cursor="pointer"
                  onClick={handleGoogleSignIn}
                >
                  <GoogleIcon />
                  <Text ml={2} userSelect="none">
                    Continue with Google
                  </Text>
                </Center>
              </VStack>
            ) : (
              <VStack
                p={{ base: 5, sm: 9 }}
                mt={10}
                maxW="md"
                mx={{ base: 5, md: "auto" }}
                bg={{ base: "transparent", sm: "whiteAlpha.50" }}
                boxShadow={{ base: "none", sm: "md" }}
                borderRadius={{ base: "none", sm: "xl" }}
              >
                <Heading size="md">Reset your password</Heading>
                <Text color="gray.500" px="auto">
                  {
                    "Enter your email to reset your password, we'll send you a link to get back into your account."
                  }
                </Text>
                <Stack textAlign="left" width="100%" py={3}>
                  <FormControl isInvalid={resetPasswordStatus.status}>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" ref={emailRef} />
                    {resetPasswordStatus.status && (
                      <FormErrorMessage>
                        {resetPasswordStatus.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <Button
                    w="100%"
                    colorScheme="blue"
                    type="submit"
                    isLoading={isLoading}
                    mt={3}
                    spinner={<BeatLoader size={8} color="white" />}
                    onClick={handleForgotPassword}
                  >
                    Reset Password
                  </Button>
                </Stack>
                <Button
                  variant="link"
                  onClick={() => {
                    setForgotPasswordButton((current) => !current);
                    //removing alerts when the button is clicked
                    setErrorStatus(false);
                    setSuccessStatus(false);
                  }}
                  leftIcon={<ArrowBackIcon />}
                >
                  Back to login
                </Button>
              </VStack>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Login;
