const { createContext, useReducer, useContext } = require("react");

const SessionContext = createContext();

const initialSessionState = {
  loading: true,
  user: {},
  userError: "",
};

function sessionReducer(state, action) {
  switch (action.type) {
    case "setLoading":
      return {
        ...state,
        loading: !!action.payload,
      };
    case "setUser":
      return {
        ...state,
        loading: false,
        user: action.payload ?? {},
      };
    case "setUserError":
      return {
        ...state,
        loading: false,
        userError: action.payload ?? "",
      };
    default:
      throw new Error(`Unsupported action type ${action.type}`);
  }
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  return (
    <SessionContext.Provider value={[state, dispatch]}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  } else {
    return context;
  }
}
