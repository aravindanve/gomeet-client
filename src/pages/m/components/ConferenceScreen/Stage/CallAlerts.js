import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMeetingContext } from "../../../../../contexts/meeting";
import AlertFlex from "../../AlertFlex";
import AdmitFlex from "../AdmitFlex";

export default function CallAlerts() {
  const [meetingState] = useMeetingContext();
  const [audioErrorDismissed, setAudioErrorDismissed] = useState(false);
  const [videoErrorDismissed, setVideoErrorDismissed] = useState(false);
  const [participantsWaiting, setParticipantsWaiting] = useState([]);
  const [participantDismissedMap, setParticipantDismissedMap] = useState({});

  const participantWaiting = participantsWaiting[0];

  const onParticipantDismiss = () => {
    setParticipantDismissedMap((map) => ({
      ...map,
      [participantWaiting.id]: true,
    }));
  };

  useEffect(() => {
    setParticipantDismissedMap((map) =>
      meetingState.participantsWaiting.reduce(
        (acc, it) => (map[it.id] ? ((acc[it.id] = true), acc) : acc),
        {}
      )
    );
  }, [meetingState.participantsWaiting]);

  useEffect(() => {
    setParticipantsWaiting(
      meetingState.participantsWaiting.filter(
        (it) =>
          !meetingState.participantMap[it.id] && !participantDismissedMap[it.id]
      )
    );
  }, [
    meetingState.participantMap,
    meetingState.participantsWaiting,
    participantDismissedMap,
  ]);

  return (
    <Flex
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      direction="column"
      justifyContent="start"
      alignItems="center"
      p={3}
      gap={3}
    >
      <Flex direction="column" alignItems="center" gap={3}>
        {!audioErrorDismissed && meetingState.localAudioTrackError ? (
          <AlertFlex
            showDismiss={true}
            onDismiss={() => setAudioErrorDismissed(true)}
          >
            {meetingState.localAudioTrackError}
          </AlertFlex>
        ) : null}
        {!videoErrorDismissed && meetingState.localVideoTrackError ? (
          <AlertFlex
            showDismiss={true}
            onDismiss={() => setVideoErrorDismissed(true)}
          >
            {meetingState.localVideoTrackError}
          </AlertFlex>
        ) : null}
        {participantWaiting ? (
          <AdmitFlex
            participant={participantWaiting}
            onAdmit={onParticipantDismiss}
            onDeny={onParticipantDismiss}
          />
        ) : null}
      </Flex>
    </Flex>
  );
}
