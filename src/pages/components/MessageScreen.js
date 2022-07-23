import { Flex, Text } from "@chakra-ui/react";
import Layout from "./Layout";
import WrappedLink from "./WrappedLink";

export default function MessageScreen({ message }) {
  return (
    <Layout alignItems="center" justifyContent="center">
      <Flex direction="column" alignItems="center" gap={3}>
        <Text fontSize={"xl"}>{message}</Text>
        <WrappedLink color={"purple.500"} href="/">
          Back to home
        </WrappedLink>
      </Flex>
    </Layout>
  );
}
