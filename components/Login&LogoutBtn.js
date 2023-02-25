import { useUserContext } from "@/firebase/auth";
import React from "react";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { BeatLoader } from "react-spinners";

const AuthBtn = () => {
  const { userData, isLoading, userLogOut } = useUserContext();

  return (
    <>
      {!userData ? (
        <Link href="/login">
          <Button colorScheme="blue" variant="outline">
            Login / Signup
          </Button>
        </Link>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default AuthBtn;
