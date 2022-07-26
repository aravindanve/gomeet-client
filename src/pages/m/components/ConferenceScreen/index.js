import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useMeetingContext } from "../../../../contexts/meeting";
import Layout from "../../../components/Layout";
import ControlBar from "./ControlBar";
import SidePanel from "./SidePanel";
import Stage from "./Stage";

export default function ConferenceScreen() {
  const bg = useColorModeValue("gray.300", "gray.900");
  const [meetingState] = useMeetingContext();
  const [activeSidePanelTab, setActiveSidePanelTab] = useState();

  // TODO:
  // show track errors
  // participant count
  // speaker vs grid mode
  // participant panel
  // chat panel
  // screen share
  // signal stats

  // TODO: debug audio and video publish after unpublish

  const audioQueue = useRef(Promise.resolve());

  // publish audio track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localAudioTrack;

    if (!room || !track) {
      return;
    }

    const publish = async () => {
      try {
        await room.localParticipant.publishTrack(track);
        console.log("PUBLISHED_AUDIO");
      } catch (error) {
        console.error("error publishing audio track", error);
      }
    };

    const unpublish = async () => {
      try {
        room.localParticipant.unpublishTrack(track, false);
        console.log("UNPUBLISHED_AUDIO");
      } catch (error) {
        console.error("error unpublishing audio track", error);
      }
    };

    // chain publish to queue
    audioQueue.current = audioQueue.current.then(publish);

    return () => {
      // chain unpublish to queue
      audioQueue.current = audioQueue.current.then(unpublish);
    };
  }, [meetingState.conferenceRoom, meetingState.localAudioTrack]);

  const videoQueue = useRef(Promise.resolve());

  // publish video track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localVideoTrack;

    if (!room || !track) {
      return;
    }

    const publish = async () => {
      try {
        await room.localParticipant.publishTrack(track);
        console.log("PUBLISHED_VIDEO");
      } catch (error) {
        console.error("error publishing video track", error);
      }
    };

    const unpublish = async () => {
      try {
        room.localParticipant.unpublishTrack(track, false);
        console.log("UNPUBLISHED_VIDEO");
      } catch (error) {
        console.error("error unpublishing video track", error);
      }
    };

    // chain publish to queue
    videoQueue.current = videoQueue.current.then(publish);

    return () => {
      // chain unpublish to queue
      videoQueue.current = videoQueue.current.then(unpublish);
    };
  }, [meetingState.conferenceRoom, meetingState.localVideoTrack]);

  return (
    <Layout bg={bg} flexDirection="column" header={null} footer={null}>
      <Flex position="relative" flexGrow="1">
        <Stage />
        <SidePanel
          activeSidePanelTab={activeSidePanelTab}
          setActiveSidePanelTab={setActiveSidePanelTab}
        />
      </Flex>
      <ControlBar
        activeSidePanelTab={activeSidePanelTab}
        setActiveSidePanelTab={setActiveSidePanelTab}
      />
    </Layout>
  );
}
