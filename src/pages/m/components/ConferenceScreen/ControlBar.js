import {
  Button,
  Flex,
  IconButton,
  Tooltip,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import {
  Copy,
  Dots,
  InfoCircle,
  Messages,
  MicrophoneOff,
  Moon,
  PhoneOff,
  ScreenShare,
  Sun,
  Users,
  VideoOff,
} from "tabler-icons-react";
import { useMeetingContext } from "../../../../contexts/meeting";

export default function ControlBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [meetingState] = useMeetingContext();
  const mobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex justifyContent="space-between" p={3}>
      <Flex alignItems="center" gap={3}>
        {!mobile ? (
          <Tooltip label="Copy meeting link">
            <Button
              variant="ghost"
              colorScheme="gray"
              isRound
              rightIcon={<Copy />}
            >
              {meetingState.meeting.code}
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="Copy meeting link">
            <IconButton
              variant="ghost"
              colorScheme="gray"
              isRound
              icon={<Copy />}
            >
              {meetingState.meeting.code}
            </IconButton>
          </Tooltip>
        )}
      </Flex>
      <Flex gap={3}>
        <Tooltip label="Unmute microphone">
          <IconButton colorScheme="red" isRound icon={<MicrophoneOff />} />
        </Tooltip>
        <Tooltip label="Unmute camera">
          <IconButton colorScheme="red" isRound icon={<VideoOff />} />
        </Tooltip>
        {!mobile ? (
          <>
            <Tooltip label="Start screen sharing">
              <IconButton colorScheme="gray" isRound icon={<ScreenShare />} />
            </Tooltip>
          </>
        ) : null}
        <Tooltip label="End call">
          <IconButton
            colorScheme="purple"
            isRound
            icon={<PhoneOff />}
            width="72px"
            // TODO: ask end for all or just for me for admins
          />
        </Tooltip>
      </Flex>
      <Flex gap={3}>
        {!mobile ? (
          <>
            <Tooltip label="Participants">
              <IconButton
                variant="ghost"
                colorScheme="gray"
                isRound
                icon={<Users />}
              />
            </Tooltip>
            <Tooltip label="Messages">
              <IconButton
                variant="ghost"
                colorScheme="purple"
                isRound
                icon={<Messages />}
              />
            </Tooltip>
            <Tooltip label={colorMode === "light" ? "Dark Mode" : "Light Mode"}>
              <IconButton
                variant="ghost"
                colorScheme="gray"
                isRound
                icon={colorMode === "light" ? <Moon /> : <Sun />}
                onClick={toggleColorMode}
              />
            </Tooltip>
            <Tooltip label="Meeting Info">
              <IconButton
                variant="ghost"
                colorScheme="gray"
                isRound
                icon={<InfoCircle />}
              />
            </Tooltip>
          </>
        ) : null}
        <Tooltip label="More">
          <IconButton
            variant="ghost"
            colorScheme="gray"
            isRound
            icon={<Dots />}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
