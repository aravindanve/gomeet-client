import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useBreakpointValue,
  useClipboard,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Copy,
  Dots,
  InfoCircle,
  Maximize,
  Messages,
  Moon,
  PhoneOff,
  ScreenShare,
  Sun,
  Users,
} from "tabler-icons-react";
import { useMeetingContext } from "../../../../contexts/meeting";
import { makeInfoToast } from "../../../../utils/toast";
import Tooltip from "../../../components/Tooltip";
import TrackControls from "../TrackControls";

export default function ControlBar({
  activeSidePanelTab,
  setActiveSidePanelTab,
}) {
  const toast = useToast();
  const mobile = useBreakpointValue({ base: true, md: false });
  const { colorMode, toggleColorMode } = useColorMode();
  const [meetingState, meetingDispatch] = useMeetingContext();
  const [showLeaveMeetingAlert, setShowLeaveMeetingAlert] = useState(false);
  const { onCopy: _onCopyMeetingLink } = useClipboard(meetingState.meetingLink);

  const onCopyMeetingLink = () => {
    _onCopyMeetingLink();
    if (!toast.isActive("meetingLinkCopied")) {
      toast(
        makeInfoToast("Your meeting link has been copied!", "meetingLinkCopied")
      );
    }
  };

  const onLeaveMeeting = () => {
    meetingDispatch({
      type: "setLeft",
      payload: {
        message: "You left the meeting",
        showRejoin: true,
      },
    });
  };

  const onEndMeeting = () => {
    // TODO: send end meeting signal
    meetingDispatch({
      type: "setLeft",
      payload: {
        message: "You ended the meeting",
        showRejoin: true,
      },
    });
  };

  return (
    <>
      <Flex justifyContent="space-between" p={3}>
        <Flex alignItems="center" gap={3}>
          {!mobile ? (
            <Tooltip text="Copy meeting link">
              <Button
                variant="ghost"
                colorScheme="gray"
                rightIcon={<Copy />}
                onClick={() => {
                  onCopyMeetingLink();
                }}
              >
                {meetingState.meeting.code}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip text="Copy meeting link">
              <IconButton
                variant="ghost"
                colorScheme="gray"
                isRound
                icon={<Copy />}
                onClick={() => {
                  onCopyMeetingLink();
                }}
              >
                {meetingState.meeting.code}
              </IconButton>
            </Tooltip>
          )}
        </Flex>
        <Flex gap={3}>
          <TrackControls />
          {!mobile ? (
            <>
              <Tooltip text="Start screen sharing">
                <IconButton colorScheme="gray" isRound icon={<ScreenShare />} />
              </Tooltip>
            </>
          ) : null}
          <Tooltip text="Leave meeting">
            <IconButton
              colorScheme="purple"
              isRound
              icon={<PhoneOff />}
              width="72px"
              onClick={() => setShowLeaveMeetingAlert(true)}
            />
          </Tooltip>
        </Flex>
        <Flex gap={3}>
          {!mobile ? (
            <>
              <Tooltip text="Participants">
                <IconButton
                  variant="ghost"
                  colorScheme={
                    activeSidePanelTab === "participants" ? "purple" : "gray"
                  }
                  isRound
                  icon={<Users />}
                  onClick={() =>
                    setActiveSidePanelTab(
                      activeSidePanelTab !== "participants"
                        ? "participants"
                        : undefined
                    )
                  }
                />
              </Tooltip>
              <Tooltip text="Messages">
                <IconButton
                  variant="ghost"
                  colorScheme={
                    activeSidePanelTab === "messages" ? "purple" : "gray"
                  }
                  isRound
                  icon={<Messages />}
                  onClick={() =>
                    setActiveSidePanelTab(
                      activeSidePanelTab !== "messages" ? "messages" : undefined
                    )
                  }
                />
              </Tooltip>
              <Tooltip text="Meeting Info">
                <IconButton
                  variant="ghost"
                  colorScheme={
                    activeSidePanelTab === "meetingInfo" ? "purple" : "gray"
                  }
                  isRound
                  icon={<InfoCircle />}
                  onClick={() =>
                    setActiveSidePanelTab(
                      activeSidePanelTab !== "meetingInfo"
                        ? "meetingInfo"
                        : undefined
                    )
                  }
                />
              </Tooltip>
              <Tooltip
                text={colorMode === "light" ? "Dark Mode" : "Light Mode"}
              >
                <IconButton
                  variant="ghost"
                  colorScheme="gray"
                  isRound
                  icon={colorMode === "light" ? <Moon /> : <Sun />}
                  onClick={toggleColorMode}
                />
              </Tooltip>
            </>
          ) : null}
          <Menu>
            {({ isOpen }) => (
              <>
                <Tooltip text="More" visible={isOpen ? false : null}>
                  <MenuButton
                    as={IconButton}
                    variant="ghost"
                    colorScheme="gray"
                    isRound
                    icon={<Dots />}
                  >
                    Actions
                  </MenuButton>
                </Tooltip>
                <MenuList>
                  {mobile ? (
                    <>
                      <MenuItem
                        icon={<Users />}
                        onClick={() => setActiveSidePanelTab("participants")}
                      >
                        Participants
                      </MenuItem>
                      <MenuItem
                        icon={<Messages />}
                        onClick={() => setActiveSidePanelTab("messages")}
                      >
                        Messages
                      </MenuItem>
                      <MenuItem
                        icon={<InfoCircle />}
                        onClick={() => setActiveSidePanelTab("meetingInfo")}
                      >
                        Meeting Info
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        icon={colorMode === "light" ? <Moon /> : <Sun />}
                        onClick={toggleColorMode}
                      >
                        {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                      </MenuItem>
                    </>
                  ) : null}
                  <MenuItem icon={<Maximize />}>Fullscreen</MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </Flex>

      <AlertDialog
        isOpen={showLeaveMeetingAlert}
        onClose={() => setShowLeaveMeetingAlert(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Leave meeting
            </AlertDialogHeader>
            <AlertDialogBody>
              Do you want to end or leave the meeting?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Flex flexGrow={1}>
                <Flex>
                  <Button onClick={() => setShowLeaveMeetingAlert(false)}>
                    Cancel
                  </Button>
                </Flex>
                <Flex flexGrow={1} justifyContent="end">
                  <Button colorScheme="red" onClick={onEndMeeting} ml={3}>
                    End for all
                  </Button>
                  <Button colorScheme="purple" onClick={onLeaveMeeting} ml={3}>
                    Leave
                  </Button>
                </Flex>
              </Flex>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
