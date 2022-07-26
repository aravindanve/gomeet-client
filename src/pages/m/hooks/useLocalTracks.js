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
      const track = meetingState.localAudioTrack;
      if (track) {
        track.mute().catch(console.error);
        console.log(logTag, "muted audio track");
      }
    } else {
      // unmute track if present
      const track = meetingState.localAudioTrack;
      if (track) {
        track.unmute().catch(console.error);
        console.log(logTag, "unmuted audio track");
      } else {
        (async () => {
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
    meetingDispatch,
    meetingState.localAudioTrack,
    meetingState.localAudioTrackMuted,
    audioErrorHandler,
    meetingState.left,
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
      // clear track if present
      if (meetingState.localVideoTrack) {
        meetingDispatch({
          type: "setLocalVideoTrack",
          payload: undefined,
        });
      }
    } else {
      // create track if not present
      if (!meetingState.localVideoTrack) {
        (async () => {
          try {
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

            // set audio device id if unset
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
    meetingDispatch,
    meetingState.left,
    meetingState.localVideoTrack,
    meetingState.localVideoTrackMuted,
    videoErrorHandler,
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
