const { createContext, useReducer, useContext } = require("react");

const MeetingContext = createContext();

const initialMeetingState = {
  loading: true,
  meeting: {},
  meetingMessage: "",
  meetingError: "",
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
