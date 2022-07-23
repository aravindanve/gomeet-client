const { createContext, useReducer, useContext } = require("react");

const MeetingContext = createContext();

const initialMeetingState = {
  loading: true,
  meeting: {},
  meetingMessage: "",
  meetingError: "",
  participant: {},
  participants: [],
  participantsWaiting: [],
  waitingRoom: undefined,
  waitingRoomError: "",
  waitingRoomParticipants: [],
  conferenceRoom: undefined,
  conferenceRoomError: "",
  conferenceRoomParticipants: [],
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
      const participantWaiting = waitingRoomParticipants.map((it) => {
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
        participantWaiting,
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
