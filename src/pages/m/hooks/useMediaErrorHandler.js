import { useToast } from "@chakra-ui/react";
import { MediaDeviceFailure } from "livekit-client";
import { useCallback } from "react";
import { useMeetingContext } from "../../../contexts/meeting";

export const useMediaErrorHandler = (kind) => {
  const toast = useToast();
  const [, meetingDispatch] = useMeetingContext();

  return useCallback(
    (error) => {
      const failure = MediaDeviceFailure.getFailure(error);
      const action =
        kind === "microphone"
          ? "setLocalAudioTrackError"
          : kind === "camera"
          ? "setLocalVideoTrackError"
          : "";

      let message;
      switch (failure) {
        case MediaDeviceFailure.PermissionDenied:
          message = `The permission to access your ${kind} was denied.`;
          meetingDispatch({ type: action, payload: message });
          if (!toast.isActive(kind + "PermissionDenied")) {
            toast(makeErrorToast(message, kind + "PermissionDenied"));
          }
          break;

        case MediaDeviceFailure.NotFound:
          message = `No ${kind} was detected, ensure a working ${kind} is plugged in.`;
          meetingDispatch({ type: action, payload: message });
          if (!toast.isActive(kind + "NotFound")) {
            toast(makeErrorToast(message, kind + "NotFound"));
          }
          break;

        case MediaDeviceFailure.DeviceInUse:
          message = `Your ${kind} is being used by another application.`;
          meetingDispatch({ type: action, payload: message });
          if (!toast.isActive(kind + "DeviceInUse")) {
            toast(makeErrorToast(message, kind + "DeviceInUse"));
          }
          break;

        default:
          message = getErrorMessage(error);
          meetingDispatch({ type: action, payload: message });
          if (!toast.isActive(kind + "Error")) {
            toast(makeErrorToast(message, kind + "Error"));
          }
      }
    },
    [kind, meetingDispatch, toast]
  );
};
