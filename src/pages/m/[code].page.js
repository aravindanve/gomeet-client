import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeetingContext } from "../../contexts/meeting";
import { MeetingsAPI } from "../../services/api";
import { getErrorMessage } from "../../utils/error";
import LayoutError from "../compoments/LayoutError";
import LayoutLoading from "../compoments/LayoutLoading";
import LayoutMessage from "../compoments/LayoutMessage";
import MeetingReady from "./components/MeetingReady";

export default function MeetingPage() {
  const router = useRouter();
  const [meetingState, meetingDispatch] = useMeetingContext();

  useEffect(() => {
    if (!router.query.code) {
      return;
    }

    (async () => {
      try {
        const {
          data: { meetings },
        } = await MeetingsAPI.all({
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
        <LayoutLoading />
      ) : meetingState.meetingError ? (
        <LayoutError message={meetingState.meetingError} showRefresh={true} />
      ) : meetingState.meetingMessage ? (
        <LayoutMessage message={meetingState.meetingMessage} />
      ) : meetingState.meeting.id ? (
        <MeetingReady />
      ) : (
        <LayoutError message={"UNKNOWN_MEETING_STATE"} showRefresh={true} />
      )}
    </>
  );
}
