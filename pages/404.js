import { Heading, Image, VStack } from "@chakra-ui/react";
import React from "react";
import Head from "next/head";
const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 page-not-found</title>
      </Head>
      <VStack mt={5}>
        <Heading>404 page-not-found</Heading>
        <Image
          src="/empty.svg"
          h={{ md: "50vh" }}
          w={{ md: "50vw" }}
          mx="auto"
          alt="no_plans_added_image"
        />
      </VStack>
    </>
  );
};

export default NotFound;
