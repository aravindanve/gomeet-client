import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeetingContext } from "../../../../contexts/meeting";
import { useSessionContext } from "../../../../contexts/session";
import { ParticipantAPI } from "../../../../services/api";
import { getErrorMessage } from "../../../../utils/error";

export default function ReadyStep2({ joinData }) {
  const router = useRouter();
  const [sessionState] = useSessionContext();
  const [meetingState, meetingDispatch] = useMeetingContext();

  const admin = meetingState.meeting.userId === sessionState.user.id;

  // create participant
  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        const { data: participant } = await ParticipantAPI.create(
          meetingState.meeting.id,
          joinData
        );
        if (canceled) {
          return;
        }

        meetingDispatch({
          type: "setParticipant",
          payload: participant,
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        console.error("error creating participant", error);
        meetingDispatch({
          type: "setMeetingError",
          payload: getErrorMessage(error),
        });
      }
    })();

    return () => {
      canceled = true;
    };
  }, [joinData, meetingDispatch, meetingState.meeting.id]);

  return (
    <Flex flexGrow={1} direction="column" justifyContent="center" gap={6}>
      <Box width="100%">
        <Flex justifyContent={["center", "start"]} alignItems="center" gap={3}>
          <Spinner size="lg" color="purple.500" />
          <Heading size="md">
            {admin ? "Joining meeting" : "Asking to be let in"}
          </Heading>
        </Flex>
      </Box>
      <Box width="100%">
        <FormLabel textAlign={["center", "start"]}>
          Camera &amp; Microphone
        </FormLabel>
        <Text color="gray.500" textAlign={["center", "start"]}>
          You can change your camera, microphone or mute them using the controls
          on the preview
        </Text>
      </Box>
      <Box width="100%" textAlign={["center", "start"]}>
        <Button flexShrink={0} onClick={() => router.push("/")}>
          Back to home
        </Button>
      </Box>
    </Flex>
  );
}
