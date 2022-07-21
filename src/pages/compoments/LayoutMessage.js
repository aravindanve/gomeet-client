import { Flex, Text } from "@chakra-ui/react";
import LayoutFlex from "./LayoutFlex";
import WrappedLink from "./WrappedLink";

export default function LayoutMessage({ message }) {
  return (
    <LayoutFlex alignItems="center" justifyContent="center">
      <Flex direction="column" alignItems="center" gap={3}>
        <Text fontSize={"xl"}>{message}</Text>
        <WrappedLink color={"purple.500"} href="/">
          Back to home
        </WrappedLink>
      </Flex>
    </LayoutFlex>
  );
}
