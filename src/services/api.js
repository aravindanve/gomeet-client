import axios from "axios";
import { AuthManager } from "./auth";

const agent = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const configWithCredentials = async (config) => {
  return {
    ...config,
    headers: {
      ...config?.headers,
      ...(await AuthManager.getHeader().then((it) =>
        it ? { authorization: it } : {}
      )),
    },
  };
};

export const APIManager = {
  get: async (url, config) =>
    agent.get(url, {
      ...config,
      ...(await configWithCredentials(config)),
    }),
  post: async (url, data, config) =>
    agent.post(url, data, {
      ...config,
      ...(await configWithCredentials(config)),
    }),
  put: async (url, data, config) =>
    agent.put(url, data, {
      ...config,
      ...(await configWithCredentials(config)),
    }),
  delete: async (url, config) =>
    agent.delete(url, {
      ...config,
      ...(await configWithCredentials(config)),
    }),
};

export const SessionAPI = {
  get: (headers) => APIManager.get(`/session`, { headers }),
};

export const AuthAPI = {
  create: (data) => APIManager.post(`/auth`, data),
  refresh: (authId, data) => APIManager.post(`/auth/${authId}/refresh`, data),
};

export const MeetingAPI = {
  all: (params) => APIManager.get(`/meetings`, { params }),
  one: (meetingId, params) =>
    APIManager.get(`/meetings/${meetingId}`, { params }),
  create: (data) => APIManager.post(`/meetings`, data),
};

export const ParticipantAPI = {
  one: (meetingId, participantId, params) =>
    APIManager.get(`/meetings/${meetingId}/participants/${participantId}`, {
      params,
    }),
  create: (meetingId, data) =>
    APIManager.post(`/meetings/${meetingId}/participants`, data),
  update: (meetingId, participantId, data) =>
    APIManager.put(
      `/meetings/${meetingId}/participants/${participantId}`,
      data
    ),
};
