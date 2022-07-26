import {
  ConnectionState,
  LogLevel,
  Room,
  RoomEvent,
  setLogLevel,
  VideoPresets,
} from "livekit-client";
import { useEffect } from "react";
import { useMeetingContext } from "../../../contexts/meeting";
import { safeDecodeDataPacketJSON } from "../../../utils/dataPacket";
import { getErrorMessage } from "../../../utils/error";

const logTag = "CONFERENCE_ROOM";

setLogLevel(LogLevel.debug);

export const useConferenceRoom = () => {
  const [meetingState, meetingDispatch] = useMeetingContext();

  const roomToken = meetingState.participant.roomTokens?.find(
    (it) => it.roomType === "conference"
  );

  // manage room
  useEffect(() => {
    if (
      meetingState.left ||
      !meetingState.meeting.id ||
      !meetingState.participant.id ||
      !roomToken
    ) {
      return;
    }

    let canceled = false;
    let room;

    const onConnectionStateChanged = (state) => {
      if (state === ConnectionState.Disconnected) {
        meetingDispatch({
          type: "setLeft",
          payload: {
            message: "You were disconnected from the meeting",
            showRejoin: true,
          },
        });
      } else {
        // HACK: catch rejections on newly created connectFuture to
        // suppress unhandled rejection error until the issue is resolved
        // https://github.com/livekit/client-sdk-js/issues/356
        if (room?.connectFuture && !room.connectFuture.promise._handled) {
          room.connectFuture.promise._handled = true;
          room.connectFuture.promise.catch(console.warn);
        }
      }
    };

    const onParticipantsChanged = () => () => {
      const participants = [
        room.localParticipant,
        ...Array.from(room.participants.values()),
      ];

      meetingDispatch({
        type: "setConferenceRoomParticipants",
        payload: participants,
      });
    };

    const onDataReceived = async (payload) => {
      let data = safeDecodeDataPacketJSON(payload);
      if (
        data?.type !== "participantAdmitted" &&
        data?.type !== "participantDenied"
      ) {
        console.warn(logTag, "unsupported data received", data);
        return;
      }
      // skip messages not for me
      if (data.id !== room.localParticipant.identity) {
        return;
      }

      try {
        const { data: participant } = await ParticipantAPI.one(
          meetingState.meeting.id,
          meetingState.participant.id
        );

        meetingDispatch({
          type: "setParticipant",
          payload: participant,
        });
        console.info(logTag, "participant updated", participant);
      } catch (error) {
        console.error(logTag, "error retrieving participant", error);
        meetingDispatch({
          type: "setParticipant",
          payload: {},
        });
      }
    };

    (async () => {
      meetingDispatch({
        type: "setConferenceRoomError",
        payload: "",
      });

      try {
        room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h1080.resolution,
          },
          stopLocalTrackOnUnpublish: false,
        });

        // connect to room
        await room.connect(
          process.env.NEXT_PUBLIC_LIVEKIT_URL,
          roomToken.accessToken
        );

        if (canceled) {
          console.info(logTag, "connection canceled, disconnecting", room);
          await room.disconnect().catch(console.error);
          return;
        }

        // handle events
        room.on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
        room.on(RoomEvent.ParticipantConnected, onParticipantsChanged);
        room.on(RoomEvent.ParticipantDisconnected, onParticipantsChanged);
        room.on(RoomEvent.DataReceived, onDataReceived);

        // set room to context
        meetingDispatch({
          type: "setConferenceRoom",
          payload: room,
        });
        console.info(logTag, "setup complete", room);
        //
      } catch (error) {
        if (canceled) {
          return;
        }

        console.error(logTag, "error setting up room", error);
        meetingDispatch({
          type: "setConferenceRoomError",
          payload: "Conference room error: " + getErrorMessage(error),
        });
      }
    })();

    return () => {
      canceled = true;

      // clear room from context
      meetingDispatch({
        type: "setConferenceRoom",
        payload: undefined,
      });

      (async () => {
        try {
          // unhandle events
          room?.off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
          room?.off(RoomEvent.ParticipantConnected, onParticipantsChanged);
          room?.off(RoomEvent.ParticipantDisconnected, onParticipantsChanged);
          room?.off(RoomEvent.DataReceived, onDataReceived);

          // disconnect from room
          await room?.disconnect();
          //
        } catch (error) {
          console.error(logTag, "error destroying room", error);
        }
      })();
    };
  }, [
    meetingDispatch,
    meetingState.left,
    meetingState.meeting.id,
    meetingState.participant.id,
    roomToken,
  ]);
};
