import { Flex } from "@chakra-ui/react";
import { useMeetingContext } from "../../../../../contexts/meeting";
import CallAlerts from "./CallAlerts";
import GridView from "./GridView";

export default function Stage() {
  const [meetingState] = useMeetingContext();

  const participants = meetingState.conferenceRoomParticipants.slice(0, 16);

  return (
    <Flex
      position="relative"
      flexGrow="1"
      justifyContent="center"
      alignItems="center"
    >
      <GridView participants={participants} />
      <CallAlerts />
    </Flex>
  );
}
