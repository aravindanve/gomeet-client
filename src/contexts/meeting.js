const { createContext, useReducer, useContext } = require("react");

const MeetingContext = createContext();

const initialMeetingState = {
  loading: true,
  meeting: {},
  meetingLink: "",
  meetingMessage: "",
  meetingError: "",
  participant: {},
  participants: [],
  participantsWaiting: [],
  localAudioTrack: undefined,
  localAudioTrackError: "",
  localAudioTrackMuted: false,
  localAudioTrackDeviceId: undefined,
  localVideoTrack: undefined,
  localVideoTrackError: "",
  localVideoTrackMuted: false,
  localVideoTrackDeviceId: undefined,
  waitingRoom: undefined,
  waitingRoomError: "",
  waitingRoomParticipants: [],
  conferenceRoom: undefined,
  conferenceRoomError: "",
  conferenceRoomParticipants: [],
  left: false,
  leftMessage: "",
  leftShowRejoin: "",
};

function meetingReducer(state, action) {
  switch (action.type) {
    case "setLoading":
      return {
        ...state,
        loading: !!action.payload,
      };
    case "setMeeting":
      return {
        ...state,
        loading: false,
        meeting: action.payload ?? {},
      };
    case "setMeetingLink":
      return {
        ...state,
        meetingLink: action.payload,
      };
    case "setMeetingMessage":
      return {
        ...state,
        loading: false,
        meetingMessage: action.payload ?? "",
      };
    case "setMeetingError":
      return {
        ...state,
        loading: false,
        meetingError: action.payload ?? "",
      };
    case "setParticipant":
      return {
        ...state,
        participant: action.payload ?? {},
      };
    case "setLocalAudioTrack":
      return {
        ...state,
        localAudioTrack: action.payload,
      };
    case "setLocalAudioTrackError":
      return {
        ...state,
        localAudioTrackError: action.payload ?? "",
      };
    case "setLocalAudioTrackMuted":
      return {
        ...state,
        localAudioTrackMuted: action.payload ?? false,
      };
    case "setLocalAudioTrackDeviceId":
      return {
        ...state,
        localAudioTrackDeviceId: action.payload,
      };
    case "setLocalAudioTrackDeviceIdIfUnset":
      return {
        ...state,
        localAudioTrackDeviceId:
          state.localAudioTrackDeviceId ?? action.payload,
      };
    case "setLocalVideoTrack":
      return {
        ...state,
        localVideoTrack: action.payload,
      };
    case "setLocalVideoTrackError":
      return {
        ...state,
        localVideoTrackError: action.payload ?? "",
      };
    case "setLocalVideoTrackMuted":
      return {
        ...state,
        localVideoTrackMuted: action.payload ?? false,
      };
    case "setLocalVideoTrackDeviceId":
      return {
        ...state,
        localVideoTrackDeviceId: action.payload,
      };
    case "setLocalVideoTrackDeviceIdIfUnset":
      return {
        ...state,
        localVideoTrackDeviceId:
          state.localVideoTrackDeviceId ?? action.payload,
      };
    case "setWaitingRoom":
      return {
        ...state,
        waitingRoom: action.payload,
      };
    case "setWaitingRoomError":
      return {
        ...state,
        waitingRoomError: action.payload ?? "",
      };
    case "setWaitingRoomParticipants":
      const waitingRoomParticipants = action.payload ?? [];
      const participantsWaiting = waitingRoomParticipants.map((it) => {
        let metadata;
        try {
          metadata = JSON.parse(it.metadata);
        } catch (error) {
          console.error("error parsing room participant metadata", error);
        }

        return {
          id: it.identity,
          name: metadata?.name ?? "Unknown user",
          imageUrl: metadata?.imageUrl ?? null,
        };
      });

      return {
        ...state,
        participantsWaiting,
        waitingRoomParticipants,
      };
    case "setConferenceRoom":
      return {
        ...state,
        conferenceRoom: action.payload,
      };
    case "setConferenceRoomError":
      return {
        ...state,
        conferenceRoomError: action.payload ?? "",
      };
    case "setConferenceRoomParticipants":
      const conferenceRoomParticipants = action.payload ?? [];
      const participants = conferenceRoomParticipants.map((it) => {
        let metadata;
        try {
          metadata = JSON.parse(it.metadata);
        } catch (error) {
          console.error("error parsing room participant metadata", error);
        }

        return {
          id: it.identity,
          name: metadata?.name ?? "Unknown user",
          imageUrl: metadata?.imageUrl ?? null,
        };
      });

      return {
        ...state,
        participants,
        conferenceRoomParticipants,
      };
    case "setLeft":
      return {
        ...state,
        left: true,
        leftMessage: action.payload.message ?? "",
        leftShowRejoin: action.payload.showRejoin ?? false,
      };
    case "resetContext":
      return {
        ...initialMeetingState,
      };
    default:
      throw new Error(`Unsupported action type ${action.type}`);
  }
}

export function MeetingProvider({ children }) {
  const [state, dispatch] = useReducer(meetingReducer, initialMeetingState);
  return (
    <MeetingContext.Provider value={[state, dispatch]}>
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeetingContext() {
  const context = useContext(MeetingContext);

  if (context === undefined) {
    throw new Error("useMeetingContext must be used within a MeetingProvider");
  } else {
    return context;
  }
}
