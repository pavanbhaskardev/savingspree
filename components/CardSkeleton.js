import {
  Card,
  CardBody,
  Flex,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import React from "react";

const CardSkeleton = () => {
  return (
    <>
      <Card>
        <CardBody>
          <Flex justify="space-between">
            <SkeletonText
              noOfLines={2}
              spacing="4"
              skeletonHeight="2"
              w="50%"
            />
            <SkeletonCircle />
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default CardSkeleton;
