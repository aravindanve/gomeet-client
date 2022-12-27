import { useEffect, useRef } from "react";
import { useMeetingContext } from "../../../contexts/meeting";

const logTag = "CONFERENCE_PUBLISH";

export const useConferencePublish = () => {
  const [meetingState] = useMeetingContext();

  const audioPublishedRef = useRef(false);
  const audioQueueRef = useRef(Promise.resolve());

  // publish audio track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localAudioTrack;

    if (meetingState.left || !room || !track) {
      return;
    }

    // publish only if not already published
    if (audioPublishedRef.current) {
      return;
    }

    // publish only if track unmuted
    // see https://github.com/livekit/livekit/issues/317
    if (meetingState.localAudioTrackMutedActualState) {
      return;
    }

    const publish = async () => {
      try {
        await room.localParticipant.publishTrack(track);

        console.log(logTag, "published audio track");

        // HACK: livekit times out if publish and unpublish are called too quickly
        await new Promise((r) => setTimeout(r, 3000));
      } catch (error) {
        console.error(logTag, "error publishing audio track", error);
      }
    };

    // chain publish to queue
    audioQueueRef.current = audioQueueRef.current.then(publish);
    audioPublishedRef.current = true;
  }, [
    meetingState.conferenceRoom,
    meetingState.left,
    meetingState.localAudioTrack,
    meetingState.localAudioTrackMutedActualState,
  ]);

  // unpublish audio track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localAudioTrack;

    if (!meetingState.left || !room || !track) {
      return;
    }

    // unpublish only if already published
    if (!audioPublishedRef.current) {
      return;
    }

    const unpublish = async () => {
      try {
        room.localParticipant.unpublishTrack(track, false);

        console.log(logTag, "unpublished video track");

        // HACK: livekit times out if publish and unpublish are called too quickly
        await new Promise((r) => setTimeout(r, 3000));
      } catch (error) {
        console.error(logTag, "error unpublishing video track", error);
      }
    };

    // chain unpublish to queue
    audioQueueRef.current = audioQueueRef.current.then(unpublish);
    audioPublishedRef.current = false;
  }, [
    meetingState.conferenceRoom,
    meetingState.left,
    meetingState.localAudioTrack,
  ]);

  const videoPublishedRef = useRef(false);
  const videoQueueRef = useRef(Promise.resolve());

  // publish video track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localVideoTrack;

    if (meetingState.left || !room || !track) {
      return;
    }

    // publish only if not already published
    if (videoPublishedRef.current) {
      return;
    }

    // publish only if track unmuted
    // see https://github.com/livekit/livekit/issues/317
    if (meetingState.localVideoTrackMutedActualState) {
      return;
    }

    const publish = async () => {
      try {
        await room.localParticipant.publishTrack(track);

        console.log(logTag, "published video track");

        // HACK: livekit times out if publish and unpublish are called too quickly
        await new Promise((r) => setTimeout(r, 3000));
      } catch (error) {
        console.error(logTag, "error publishing video track", error);
      }
    };

    // chain publish to queue
    videoQueueRef.current = videoQueueRef.current.then(publish);
    videoPublishedRef.current = true;
  }, [
    meetingState.conferenceRoom,
    meetingState.left,
    meetingState.localVideoTrack,
    meetingState.localVideoTrackMutedActualState,
  ]);

  // unpublish video track
  useEffect(() => {
    const room = meetingState.conferenceRoom;
    const track = meetingState.localVideoTrack;

    if (!meetingState.left || !room || !track) {
      return;
    }

    // unpublish only if already published
    if (!videoPublishedRef.current) {
      return;
    }

    const unpublish = async () => {
      try {
        room.localParticipant.unpublishTrack(track, false);

        console.log(logTag, "unpublished video track");

        // HACK: livekit times out if publish and unpublish are called too quickly
        await new Promise((r) => setTimeout(r, 3000));
      } catch (error) {
        console.error(logTag, "error unpublishing video track", error);
      }
    };

    // chain unpublish to queue
    videoQueueRef.current = videoQueueRef.current.then(unpublish);
    videoPublishedRef.current = false;
  }, [
    meetingState.conferenceRoom,
    meetingState.left,
    meetingState.localVideoTrack,
  ]);
};
