import axios from "axios";
import cookies from "browser-cookies";
import dayjs from "dayjs";

let authPromise;

const authCookie = "auth";
const agent = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const clearAndReload = () => {
  AuthManager.clear();
  window.location.reload();
};

export const AuthManager = {
  set: (auth) => {
    authPromise = undefined;
    cookies.set(authCookie, JSON.stringify(auth), {
      expires: dayjs(auth.refreshTokenExpiresAt).isValid()
        ? auth.refreshTokenExpiresAt
        : auth.accessTokenExpiresAt,
    });
  },
  clear: () => {
    authPromise = undefined;
    cookies.erase(authCookie);
  },
  get: async () => {
    if (authPromise) {
      return authPromise;
    }

    // load auth
    let auth;
    try {
      let value = cookies.get(authCookie);
      if (value) {
        auth = JSON.parse(value);
      }
    } catch (error) {
      console.error("error parsing auth cookie", error);
      clearAndReload();
      return;
    }

    if (!auth) {
      return;
    }

    // validate auth
    if (
      !auth.id ||
      !auth.scheme ||
      !auth.accessToken ||
      !dayjs(auth.accessTokenExpiresAt).isValid()
    ) {
      console.error("error validating auth", auth);
      clearAndReload();
      return;
    }

    // return auth that expires after 30s
    if (dayjs(auth.accessTokenExpiresAt).diff() > 30 * 1000) {
      return auth;
    }

    // refresh and return auth if refresh token expires after 30s
    if (
      auth.refreshToken &&
      dayjs(auth.refreshTokenExpiresAt).diff() > 30 * 1000
    ) {
      authPromise = agent
        .post(`/auth/${auth.id}/refresh`, { refreshToken: auth.refreshToken })
        .then((it) => it.data)
        .then((json) => AuthManager.set(json))
        .catch((error) => {
          console.error("error refreshing auth", error);
          clearAndReload();
          return;
        });

      return authPromise;
    }

    // clear and reload if auth is expired
    clearAndReload();
    return;
  },
  getHeader: async () => {
    return AuthManager.get().then((it) =>
      it ? `${it.scheme} ${it.accessToken}` : undefined
    );
  },
};
