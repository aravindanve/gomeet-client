import { Flex, Link, Text } from "@chakra-ui/react";

export default function FooterFlex() {
  return (
    <Flex flex={0} justifyContent="center" px={6} py={6}>
      <Text>
        Developed by{" "}
        <Link
          color="purple.500"
          href="https://github.com/aravindanve"
          isExternal
        >
          Aravindan Ve
        </Link>
      </Text>
    </Flex>
  );
}
