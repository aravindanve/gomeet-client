import { useConferenceParticipant } from "../hooks/useConferenceParticipant";
import TrackView from "./TrackView";

export default function ParticipantView({ participant }) {
  const {
    metadata,
    microphonePublication,
    cameraPublication,
    isAudioMuted,
    isVideoMuted,
    isLocal,
  } = useConferenceParticipant(participant);

  return (
    <TrackView
      name={metadata.name}
      imageUrl={metadata.imageUrl}
      aspectRatio={null}
      audioTrack={microphonePublication?.track}
      videoTrack={cameraPublication?.track}
      isAudioMuted={isAudioMuted}
      isVideoMuted={isVideoMuted}
      isLocal={isLocal}
      isPreview={false}
    />
  );
}
