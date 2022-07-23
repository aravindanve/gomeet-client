import { Spinner } from "@chakra-ui/react";
import Layout from "./Layout";

export default function LoadingScreen() {
  return (
    <Layout alignItems="center" justifyContent="center">
      <Spinner size="xl" emptyColor="purple.200" color="purple.500" />
    </Layout>
  );
}
