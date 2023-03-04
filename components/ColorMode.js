import { useColorMode } from "@chakra-ui/react";
import React from "react";
import { IconButton } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <IconButton
        aria-label="switch theme"
        mr={2}
        icon={
          colorMode === "light" ? (
            <SunIcon className="sun-icon" color="yellow.500" />
          ) : (
            <MoonIcon className="moon-icon" color="#63b3ed" />
          )
        }
        onClick={() => toggleColorMode()}
        variant="ghost"
      />
    </>
  );
};

export default ColorMode;
