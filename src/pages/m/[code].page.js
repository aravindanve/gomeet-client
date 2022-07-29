import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeetingContext } from "../../contexts/meeting";
import { MeetingAPI } from "../../services/api";
import { getErrorMessage } from "../../utils/error";
import ErrorScreen from "../components/ErrorScreen";
import LoadingScreen from "../components/LoadingScreen";
import ConferenceScreen from "./components/ConferenceScreen";
import LeftScreen from "./components/LeftScreen";
import ReadyScreen from "./components/ReadyScreen";
import { useConferencePublish } from "./hooks/useConferencePublish";
import { useConferenceRoom } from "./hooks/useConferenceRoom";
import { useLocalTracks } from "./hooks/useLocalTracks";
import { useWaitingRoom } from "./hooks/useWaitingRoom";

export async function getServerSideProps(ctx) {
  return {
    props: {
      host: ctx.req.headers.host,
    },
  };
}

export default function MeetingPage({ host }) {
  const router = useRouter();
  const [meetingState, meetingDispatch] = useMeetingContext();

  const errorMessage =
    meetingState.meetingError ||
    meetingState.waitingRoomError ||
    meetingState.conferenceRoomError;

  const joined = meetingState.participant.id && meetingState.conferenceRoom;

  useLocalTracks();
  useWaitingRoom();
  useConferenceRoom();
  useConferencePublish();

  // init meeting
  useEffect(() => {
    if (!router.query.code || meetingState.left) {
      return;
    }

    meetingDispatch({
      type: "setLoading",
      payload: true,
    });

    let canceled = false;
    (async () => {
      try {
        const {
          data: { meetings },
        } = await MeetingAPI.all({
          code: router.query.code,
        });

        if (canceled) {
          return;
        }

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
        if (canceled) {
          return;
        }

        console.error("error retrieving meetings", error);
        meetingDispatch({
          type: "setMeetingError",
          payload: getErrorMessage(error),
        });
      }
    })();

    return () => {
      canceled = true;
    };
  }, [meetingDispatch, meetingState.left, router.query.code]);

  // init meeting link
  useEffect(() => {
    meetingDispatch({
      type: "setMeetingLink",
      payload: `${host}${router.asPath}`,
    });
  }, [host, meetingDispatch, router.asPath]);

  // reset meeting
  useEffect(() => {
    return () => {
      meetingDispatch({
        type: "resetContext",
      });
    };
  }, [meetingDispatch]);

  return (
    <>
      <Head>
        <title>
          {router.query.code
            ? `Meeting ${router.query.code} - LiveMeet`
            : `Meeting - LiveMeet`}
        </title>
        <meta name="description" content="Video meetings for everyone" />
      </Head>
      {meetingState.loading ? (
        <LoadingScreen />
      ) : errorMessage ? (
        <ErrorScreen message={errorMessage} showRefresh={true} />
      ) : meetingState.meetingMessage ? (
        <LeftScreen message={meetingState.meetingMessage} showRejoin={false} />
      ) : meetingState.left ? (
        <LeftScreen
          message={meetingState.leftMessage}
          showRejoin={meetingState.leftShowRejoin}
        />
      ) : joined ? (
        <ConferenceScreen />
      ) : (
        <ReadyScreen />
      )}
    </>
  );
}
