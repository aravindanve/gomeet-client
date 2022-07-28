import { Flex } from "@chakra-ui/react";
import { useMeetingContext } from "../../../../../contexts/meeting";
import GridView from "./GridView";

export default function Stage() {
  const [meetingState] = useMeetingContext();

  const participants = meetingState.conferenceRoomParticipants.slice(0, 16);

  return (
    <Flex flexGrow="1" justifyContent="center" alignItems="center">
      <GridView participants={participants} />
    </Flex>
  );
}
