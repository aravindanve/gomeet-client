import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useMeetingContext } from "../../../../contexts/meeting";
import Layout from "../../../components/Layout";
import ControlBar from "./ControlBar";
import SidePanel from "./SidePanel";
import Stage from "./Stage";

export default function ConferenceScreen() {
  const bg = useColorModeValue("gray.300", "gray.800");
  const [meetingState] = useMeetingContext();
  const [activeSidePanelTab, setActiveSidePanelTab] = useState();

  // TODO:
  // show track errors
  // participant count
  // speaker vs ~grid mode~
  // participant panel
  // chat panel
  // screen share
  // signal stats

  const audioQueue = useRef(Promise.resolve());

  // publish audio track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localAudioTrack;

    if (meetingState.left || !room || !track) {
      return;
    }

    // HACK: livekit times out if publish and unpublish are called too quickly
    const wait = () => new Promise((r) => setTimeout(r, 3000));

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
    audioQueue.current = audioQueue.current.then(publish).then(wait);

    return () => {
      // chain unpublish to queue
      audioQueue.current = audioQueue.current.then(unpublish).then(wait);
    };
  }, [
    meetingState.conferenceRoom,
    meetingState.left,
    meetingState.localAudioTrack,
  ]);

  const videoQueue = useRef(Promise.resolve());

  // publish video track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localVideoTrack;

    if (meetingState.left || !room || !track) {
      return;
    }

    // HACK: livekit times out if publish and unpublish are called too quickly
    const wait = () => new Promise((r) => setTimeout(r, 3000));

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
    videoQueue.current = videoQueue.current.then(publish).then(wait);

    return () => {
      // chain unpublish to queue
      videoQueue.current = videoQueue.current.then(unpublish).then(wait);
    };
  }, [
    meetingState.conferenceRoom,
    meetingState.left,
    meetingState.localVideoTrack,
  ]);

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
