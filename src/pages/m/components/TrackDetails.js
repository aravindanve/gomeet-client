import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useMeetingContext } from "../../../contexts/meeting";

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
        <Alert status="warning" fontSize="sm" p={1} pl={3} mt={2}>
          <AlertIcon />
          <AlertDescription>
            {meetingState.localAudioTrackError}
          </AlertDescription>
        </Alert>
      ) : null}
      {meetingState.localVideoTrackError ? (
        <Alert status="warning" fontSize="sm" p={1} pl={3} mt={2}>
          <AlertIcon />
          <AlertDescription>
            {meetingState.localVideoTrackError}
          </AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}
