import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMeetingContext } from "../../../../contexts/meeting";
import { ParticipantAPI } from "../../../../services/api";
import { getErrorMessage } from "../../../../utils/error";
import { makeErrorToast } from "../../../../utils/toast";

export default function AdmitFlex({ participant, onAdmit, onDeny, ...props }) {
  const toast = useToast();
  const bg = useColorModeValue("whiteAlpha.800", "blackAlpha.800");
  const [meetingState] = useMeetingContext();
  const [admitLoading, setAdmitLoading] = useState(false);

  const onAdmitClick = async () => {
    setAdmitLoading(true);
    try {
      await ParticipantAPI.update(meetingState.meeting.id, participant.id, {
        status: "admitted",
      });

      onAdmit && onAdmit();
    } catch (error) {
      console.error("error admitting participant", error);
      toast(makeErrorToast(getErrorMessage(error)));
    } finally {
      setAdmitLoading(false);
    }
  };

  const onDenyClick = async () => {
    onDeny && onDeny();
    try {
      await ParticipantAPI.update(meetingState.meeting.id, participant.id, {
        status: "denied",
      });
    } catch (error) {
      console.error("error denying participant", error);
      toast(makeErrorToast(getErrorMessage(error)));
    }
  };

  return (
    <Flex
      {...props}
      bg={bg}
      borderRadius="md"
      gap={2}
      px={3}
      py={2}
      fontSize="sm"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexShrink={0}>
        <Avatar size="xs" name={participant.name} src={participant.imageUrl} />
      </Flex>
      <Box>
        <Text as="span" fontWeight="semibold">
          {participant.name}&nbsp;
        </Text>{" "}
        is asking to join the meeting.
      </Box>
      <Button
        flexShrink={0}
        colorScheme="purple"
        size="xs"
        isLoading={admitLoading}
        onClick={onAdmitClick}
      >
        Admit
      </Button>
      <Button flexShrink={0} colorScheme="gray" size="xs" onClick={onDenyClick}>
        Deny
      </Button>
    </Flex>
  );
}
