import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMeetingContext } from "../../../contexts/meeting";
import Layout from "../../components/Layout";

export default function LeftScreen({ message, showRejoin }) {
  const router = useRouter();
  const [, meetingDispatch] = useMeetingContext();

  const onRejoinClick = () => {
    meetingDispatch({
      type: "resetContext",
    });
    // router.reload();
  };

  return (
    <Layout alignItems="center" justifyContent="center">
      <Flex direction="column" alignItems="center" gap={3}>
        <Text fontSize={"xl"}>{message}</Text>
        <Box width="100%" textAlign="center">
          {showRejoin ? (
            <Button
              flexShrink={0}
              colorScheme="purple"
              mr={3}
              onClick={onRejoinClick}
            >
              Rejoin
            </Button>
          ) : null}

          <Button flexShrink={0} onClick={() => router.push("/")}>
            Back to home
          </Button>
        </Box>
      </Flex>
    </Layout>
  );
}
