import { useConferenceParticipant } from "../hooks/useConferenceParticipant";
import TrackView from "./TrackView";

export default function ParticipantView({ participant }) {
  const { metadata, cameraPublication, isAudioMuted, isVideoMuted, isLocal } =
    useConferenceParticipant(participant);

  return (
    <TrackView
      name={metadata.name}
      imageUrl={metadata.imageUrl}
      aspectRatio={null}
      track={cameraPublication?.track}
      isAudioMuted={isAudioMuted}
      isVideoMuted={isVideoMuted}
      isLocal={isLocal}
      isPreview={false}
    />
  );
}
