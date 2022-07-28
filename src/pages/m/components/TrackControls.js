import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Room } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronUp,
  Microphone,
  MicrophoneOff,
  Video,
  VideoOff,
} from "tabler-icons-react";
import { useMeetingContext } from "../../../contexts/meeting";
import Tooltip from "../../components/Tooltip";

const logTag = "TRACK_CONTROLS";

export default function TrackControls() {
  const [meetingState, meetingDispatch] = useMeetingContext();
  const [state, setState] = useState({
    audioDevices: [],
    videoDevices: [],
  });

  const onAudioMuteToggle = () => {
    meetingDispatch({
      type: "setLocalAudioTrackMuted",
      payload: !meetingState.localAudioTrackMuted,
    });
  };

  const onAudioDeviceSelect = (deviceId) => {
    if (!deviceId) {
      return;
    }
    meetingDispatch({
      type: "setLocalAudioTrackDeviceId",
      payload: deviceId,
    });
  };

  const onVideoMuteToggle = () => {
    meetingDispatch({
      type: "setLocalVideoTrackMuted",
      payload: !meetingState.localVideoTrackMuted,
    });
  };

  const onVideoDeviceSelect = (deviceId) => {
    if (!deviceId) {
      return;
    }
    meetingDispatch({
      type: "setLocalVideoTrackDeviceId",
      payload: deviceId,
    });
  };

  const getAudioDevices = useCallback(async () => {
    try {
      const devices = await Room.getLocalDevices("audioinput");

      setState((state) => ({
        ...state,
        audioDevices: devices,
      }));

      console.info(logTag, "audio devices", devices);
      //
    } catch (error) {
      console.error(logTag, "error getting audio devices", error);
    }
  }, []);

  const getVideoDevices = useCallback(async () => {
    try {
      const devices = await Room.getLocalDevices("videoinput");

      setState((state) => ({
        ...state,
        videoDevices: devices,
      }));

      console.info(logTag, "video devices", devices);
      //
    } catch (error) {
      console.error(logTag, "error getting video devices", error);
    }
  }, []);

  // init devices
  useEffect(() => {
    getAudioDevices();
    getVideoDevices();
  }, [getAudioDevices, getVideoDevices]);

  return (
    <>
      <Flex>
        <Tooltip
          text={
            meetingState.localAudioTrackMuted
              ? "Unmute microphone"
              : "Mute microphone"
          }
        >
          <IconButton
            colorScheme={meetingState.localAudioTrackMuted ? "red" : "gray"}
            isRound
            icon={
              meetingState.localAudioTrackMuted ? (
                <MicrophoneOff />
              ) : (
                <Microphone />
              )
            }
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            pl={3}
            pr={2}
            mr="2px"
            onClick={onAudioMuteToggle}
          />
        </Tooltip>
        <Menu placement="top" onOpen={() => getAudioDevices()}>
          {({ isOpen }) => {
            return (
              <>
                <Tooltip
                  text="Switch microphone"
                  visible={isOpen ? false : null}
                >
                  <MenuButton
                    as={IconButton}
                    isRound
                    icon={<ChevronUp />}
                    borderTopLeftRadius={0}
                    borderBottomLeftRadius={0}
                    pl={2}
                    pr={3}
                  />
                </Tooltip>
                <MenuList>
                  {state.audioDevices.length ? (
                    state.audioDevices.map((it, i) => (
                      <MenuItem
                        key={i}
                        icon={
                          it.deviceId ===
                          meetingState.localAudioTrackDeviceId ? (
                            <ArrowRightIcon />
                          ) : undefined
                        }
                        onClick={() => onAudioDeviceSelect(it.deviceId)}
                      >
                        {it.label ?? "Unknown device"}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={-1} isDisabled={true}>
                      No devices found
                    </MenuItem>
                  )}
                </MenuList>
              </>
            );
          }}
        </Menu>
      </Flex>

      <Flex>
        <Tooltip
          text={
            meetingState.localVideoTrackMuted ? "Unmute camera" : "Mute camera"
          }
        >
          <IconButton
            colorScheme={meetingState.localVideoTrackMuted ? "red" : "gray"}
            isRound
            icon={meetingState.localVideoTrackMuted ? <VideoOff /> : <Video />}
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            pl={3}
            pr={2}
            mr="2px"
            onClick={onVideoMuteToggle}
          />
        </Tooltip>
        <Menu placement="top" onOpen={() => getVideoDevices()}>
          {({ isOpen }) => (
            <>
              <Tooltip text="Switch camera" visible={isOpen ? false : null}>
                <MenuButton
                  as={IconButton}
                  isRound
                  icon={<ChevronUp />}
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  pl={2}
                  pr={3}
                />
              </Tooltip>
              <MenuList>
                {state.videoDevices.length ? (
                  state.videoDevices.map((it, i) => (
                    <MenuItem
                      key={i}
                      icon={
                        it.deviceId === meetingState.localVideoTrackDeviceId ? (
                          <ArrowRightIcon />
                        ) : undefined
                      }
                      onClick={() => onVideoDeviceSelect(it.deviceId)}
                    >
                      {it.label ?? "Unknown device"}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem key={-1} isDisabled={true}>
                    No devices found
                  </MenuItem>
                )}
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </>
  );
}
