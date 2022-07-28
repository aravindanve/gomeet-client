import { createLocalAudioTrack, createLocalVideoTrack } from "livekit-client";
import { useEffect } from "react";
import { useMeetingContext } from "../../../contexts/meeting";
import { useMediaErrorHandler } from "./useMediaErrorHandler";

const logTag = "LOCAL_TRACKS";

export const useLocalTracks = () => {
  const audioErrorHandler = useMediaErrorHandler("microphone");
  const videoErrorHandler = useMediaErrorHandler("camera");
  const [meetingState, meetingDispatch] = useMeetingContext();

  // clear tracks on left
  useEffect(() => {
    if (meetingState.left) {
      meetingDispatch({
        type: "setLocalAudioTrack",
        payload: "",
      });
      meetingDispatch({
        type: "setLocalVideoTrack",
        payload: "",
      });
    }
  }, [meetingDispatch, meetingState.left]);

  // stop audio track on clear
  useEffect(() => {
    const track = meetingState.localAudioTrack;
    if (!track) {
      return;
    }
    return () => {
      track.stop();
      console.log(logTag, "stopped audio track");
    };
  }, [meetingState.localAudioTrack]);

  // manage audio track mute and unmute
  useEffect(() => {
    if (meetingState.left) {
      return;
    }

    let canceled = false;
    if (meetingState.localAudioTrackMuted) {
      // mute track if present
      meetingState.localAudioTrack
        ?.mute()
        .then(() => console.log(logTag, "muted audio track"))
        .catch(console.error);
    } else {
      // unmute track if present or create
      if (meetingState.localAudioTrack) {
        meetingState.localAudioTrack
          .unmute()
          .then(() => console.log(logTag, "unmuted audio track"))
          .catch(console.error);
      } else {
        (async () => {
          if (canceled) {
            return;
          }
          try {
            // create track
            const track = await createLocalAudioTrack().catch(
              audioErrorHandler
            );
            if (canceled) {
              track?.stop();
              return;
            }

            meetingDispatch({
              type: "setLocalAudioTrack",
              payload: track,
            });

            // set audio device id if unset
            const deviceId = track.mediaStreamTrack?.getSettings()?.deviceId;
            if (deviceId) {
              meetingDispatch({
                type: "setLocalAudioTrackDeviceIdIfUnset",
                payload: deviceId,
              });
            }

            console.log(logTag, "created audio track");
          } catch (error) {
            console.error(logTag, "error creating audio track", error);
          }
        })();
      }
    }

    return () => {
      canceled = true;
    };
  }, [
    audioErrorHandler,
    meetingDispatch,
    meetingState.left,
    meetingState.localAudioTrack,
    meetingState.localAudioTrackMuted,
  ]);

  // stop video track on clear
  useEffect(() => {
    const track = meetingState.localVideoTrack;
    if (!track) {
      return;
    }
    return () => {
      track.stop();
      console.log(logTag, "stopped video track");
    };
  }, [meetingState.localVideoTrack]);

  // manage video track mute and unmute
  useEffect(() => {
    if (meetingState.left) {
      return;
    }

    let canceled = false;
    if (meetingState.localVideoTrackMuted) {
      // mute track if present
      meetingState.localVideoTrack
        ?.mute()
        .then(() => console.log(logTag, "muted video track"))
        .catch(console.error);
    } else {
      // unmute track if present or create
      if (meetingState.localVideoTrack) {
        meetingState.localVideoTrack
          .unmute()
          .then(() => console.log(logTag, "unmuted video track"))
          .catch(console.error);
      } else {
        (async () => {
          if (canceled) {
            return;
          }
          try {
            // create track
            const track = await createLocalVideoTrack().catch(
              videoErrorHandler
            );
            if (canceled) {
              track?.stop();
              return;
            }

            meetingDispatch({
              type: "setLocalVideoTrack",
              payload: track,
            });

            // set video device id if unset
            const deviceId = track.mediaStreamTrack?.getSettings()?.deviceId;
            if (deviceId) {
              meetingDispatch({
                type: "setLocalVideoTrackDeviceIdIfUnset",
                payload: deviceId,
              });
            }

            console.log(logTag, "created video track");
          } catch (error) {
            console.error(logTag, "error creating video track", error);
          }
        })();
      }
    }

    return () => {
      canceled = true;
    };
  }, [
    videoErrorHandler,
    meetingDispatch,
    meetingState.left,
    meetingState.localVideoTrack,
    meetingState.localVideoTrackMuted,
  ]);

  // manage audio track device changed
  useEffect(() => {
    const track = meetingState.localAudioTrack;
    if (track) {
      const deviceId = track.mediaStreamTrack?.getSettings()?.deviceId;
      if (meetingState.localAudioTrackDeviceId !== deviceId) {
        track
          .setDeviceId(meetingState.localAudioTrackDeviceId)
          .catch(console.error);
      }
    }
  }, [meetingState.localAudioTrack, meetingState.localAudioTrackDeviceId]);

  // manage video track device changed
  useEffect(() => {
    const track = meetingState.localVideoTrack;
    if (track) {
      const deviceId = track.mediaStreamTrack?.getSettings()?.deviceId;
      if (meetingState.localVideoTrackDeviceId !== deviceId) {
        track
          .setDeviceId(meetingState.localVideoTrackDeviceId)
          .catch(console.error);
      }
    }
  }, [meetingState.localVideoTrack, meetingState.localVideoTrackDeviceId]);
};
