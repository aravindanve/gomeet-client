import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { MeetingProvider } from "../contexts/meeting";
import { SessionProvider, useSessionContext } from "../contexts/session";
import { SessionAPI } from "../services/api";
import { AuthManager } from "../services/auth";
import { getErrorMessage } from "../utils/error";
import LayoutError from "./compoments/LayoutError";
import LayoutLoading from "./compoments/LayoutLoading";
import theme from "./theme";

const MyAppWithContextValues = ({ Component, pageProps }) => {
  const [sessionState, sessionDispatch] = useSessionContext();

  useEffect(() => {
    (async () => {
      // load session
      const authHeader = await AuthManager.getHeader();
      if (authHeader) {
        try {
          const {
            data: { user },
          } = await SessionAPI.get({
            authorization: authHeader,
          });

          sessionDispatch({
            type: "setUser",
            payload: user,
          });
        } catch (error) {
          sessionDispatch({
            type: "setUserError",
            payload: getErrorMessage(error),
          });
        }
      } else {
        sessionDispatch({
          type: "setUser",
          payload: {},
        });
      }
    })();
  }, [sessionDispatch]);

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      {sessionState.loading ? (
        <LayoutLoading />
      ) : sessionState.userError ? (
        <LayoutError
          message={sessionState.userError}
          showRefresh={true}
          showSignOut={true}
          showBackToHome={false}
        />
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
};

export default function MyApp(props) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider>
        <MeetingProvider>
          <MyAppWithContextValues {...props} />
        </MeetingProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
