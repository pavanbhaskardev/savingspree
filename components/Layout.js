import { Box, Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import React from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { useUserContext } from "@/firebase/auth";

const Layout = ({ children }) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { userData } = useUserContext();
  return (
    <>
      {userData && isLargerThan768 ? (
        <Flex>
          <SideNav />
          <Box w={"100%"}>{children}</Box>
        </Flex>
      ) : (
        <>
          <Navbar />
          <div>{children}</div>
        </>
      )}
    </>
  );
};

export default Layout;
