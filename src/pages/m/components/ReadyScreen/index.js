import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import Layout from "../../../components/Layout";
import ParticipantView from "../ParticipantView";
import ReadyStep1 from "./ReadyStep1";
import ReadyStep2 from "./ReadyStep2";

export default function ReadyScreen() {
  const [state, setState] = useState({
    joining: false,
    joinData: {},
  });

  const onJoinClick = (data) => {
    setState((state) => ({
      ...state,
      joining: true,
      joinData: data,
    }));
  };

  return (
    <Layout type="wide" alignItems="center">
      <Flex
        flexGrow={1}
        direction="column"
        justifyContent="center"
        mx={[3, 6]}
        my={[16, 3]}
      >
        <Box textAlign={["center", "start"]} mb={6}>
          <Heading size="lg">Get ready</Heading>
          <Text mt={1}>
            Configure your camera and microphone and make sure you look your
            best!
          </Text>
        </Box>

        <Flex flexGrow={1} direction={["column", "row"]} gap={6}>
          <Flex flexGrow={1} width={["100%", "50%"]}>
            <ParticipantView />
          </Flex>
          <Flex flexGrow={1} width={["100%", "50%"]} direction="column">
            {!state.joining ? (
              <ReadyStep1 joinData={state.joinData} onJoinClick={onJoinClick} />
            ) : (
              <ReadyStep2 joinData={state.joinData} />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
}
