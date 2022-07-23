import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeetingContext } from "../../contexts/meeting";
import { MeetingAPI } from "../../services/api";
import { getErrorMessage } from "../../utils/error";
import ErrorScreen from "../components/ErrorScreen";
import LoadingScreen from "../components/LoadingScreen";
import MessageScreen from "../components/MessageScreen";
import ConferenceScreen from "./components/ConferenceScreen";
import ReadyScreen from "./components/ReadyScreen";
import { useConferenceRoom } from "./hooks/useConferenceRoom";
import { useWaitingRoom } from "./hooks/useWaitingRoom";

export default function MeetingPage() {
  const router = useRouter();
  const [meetingState, meetingDispatch] = useMeetingContext();

  const errorMessage =
    meetingState.meetingError ||
    meetingState.waitingRoomError ||
    meetingState.conferenceRoomError;

  const joined = meetingState.participant.id && meetingState.conferenceRoom;

  useWaitingRoom();
  useConferenceRoom();

  // init meeting
  useEffect(() => {
    if (!router.query.code) {
      return;
    }

    (async () => {
      try {
        const {
          data: { meetings },
        } = await MeetingAPI.all({
          code: router.query.code,
        });

        if (meetings.length) {
          meetingDispatch({
            type: "setMeeting",
            payload: meetings[0],
          });
        } else {
          meetingDispatch({
            type: "setMeetingMessage",
            payload: "The meeting code is either invalid or has expired",
          });
        }
      } catch (error) {
        console.error("error retrieving meetings", error);
        meetingDispatch({
          type: "setMeetingError",
          payload: getErrorMessage(error),
        });
      }
    })();
  }, [meetingDispatch, router.query.code]);

  return (
    <>
      <Head>
        <title>
          {router.query.code
            ? `Meeting ${router.query.code} - Gomeet`
            : `Meeting - Gomeet`}
        </title>
        <meta name="description" content="Video meetings for everyone" />
      </Head>
      {meetingState.loading ? (
        <LoadingScreen />
      ) : errorMessage ? (
        <ErrorScreen message={errorMessage} showRefresh={true} />
      ) : meetingState.meetingMessage ? (
        <MessageScreen message={meetingState.meetingMessage} />
      ) : joined ? (
        <ConferenceScreen />
      ) : (
        <ReadyScreen />
      )}
    </>
  );
}
