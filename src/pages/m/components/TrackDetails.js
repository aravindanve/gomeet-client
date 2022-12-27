import { FormLabel, Text } from "@chakra-ui/react";
import { useMeetingContext } from "../../../contexts/meeting";
import AlertFlex from "./AlertFlex";

export default function TrackDetails() {
  const [meetingState] = useMeetingContext();

  return (
    <>
      <FormLabel textAlign={["center", "start"]}>
        Camera &amp; Microphone
      </FormLabel>
      <Text color="gray.500" textAlign={["center", "start"]}>
        You can change your camera, microphone or mute them using the controls
        on the preview
      </Text>
      {meetingState.localAudioTrackError ? (
        <AlertFlex mt={2}>{meetingState.localAudioTrackError}</AlertFlex>
      ) : null}
      {meetingState.localVideoTrackError ? (
        <AlertFlex mt={2}>{meetingState.localVideoTrackError}</AlertFlex>
      ) : null}
    </>
  );
}
