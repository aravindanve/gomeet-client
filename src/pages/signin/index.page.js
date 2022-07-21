import parse from "co-body";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSessionContext } from "../../contexts/session";
import { AuthAPI, SessionAPI } from "../../services/api";
import { AuthManager } from "../../services/auth";
import { getErrorMessage } from "../../utils/error";
import LayoutError from "../compoments/LayoutError";
import LayoutLoading from "../compoments/LayoutLoading";

export async function getServerSideProps(ctx) {
  let idToken;
  if (ctx.req.method === "POST") {
    const body = await parse.form(ctx);
    idToken = body.credential;
  }
  return {
    props: {
      ...(idToken && { idToken }),
    },
  };
}

export default function SignInPage({ idToken }) {
  const router = useRouter();
  const [, sessionDispatch] = useSessionContext();
  const [state, setState] = useState({
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      try {
        // handle signin
        if (idToken) {
          // create auth
          const { data: auth } = await AuthAPI.create({
            googleIdToken: idToken,
          });

          AuthManager.set(auth);

          // load session
          const authHeader = await AuthManager.getHeader();
          if (authHeader) {
            const {
              data: { user },
            } = await SessionAPI.get({
              authorization: authHeader,
            });

            sessionDispatch({
              type: "setUser",
              payload: user,
            });
          }
        }

        // handle redirect
        if (router.query.next) {
          router.replace(router.query.next);
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("error signing in", error);
        setState((state) => ({
          ...state,
          loading: false,
          error: getErrorMessage(error),
        }));
      }
    })();
  }, [idToken, router, sessionDispatch]);

  return state.loading ? (
    <LayoutLoading />
  ) : state.error ? (
    <LayoutError message={state.error} />
  ) : null;
}
