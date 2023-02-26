import React from "react";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";

const CountIndicator = ({ value, charCount }) => {
  return (
    <CircularProgress
      max={value}
      mt={3}
      ml={"87.5%"}
      value={charCount}
      color={charCount === value ? "#E53E3E" : "#4299e1"}
      size={10}
    >
      <CircularProgressLabel fontSize={10}>
        {value - charCount}
      </CircularProgressLabel>
    </CircularProgress>
  );
};

export default CountIndicator;
