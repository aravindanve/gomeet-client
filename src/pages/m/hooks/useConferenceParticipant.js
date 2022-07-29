import { LocalParticipant, ParticipantEvent, Track } from "livekit-client";
import { useEffect, useState } from "react";

const logTag = "CONFERENCE_PARTICIPANT";

export const useConferenceParticipant = (participant) => {
  const [isAudioMuted, setAudioMuted] = useState(true);
  const [isVideoMuted, setVideoMuted] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState(
    participant.connectionQuality
  );
  const [isSpeaking, setSpeaking] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [publications, setPublications] = useState([]);
  const [subscribedTracks, setSubscribedTracks] = useState([]);

  useEffect(() => {
    const onMuted = (pub) => {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(true);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(true);
      }
    };

    const onUnmuted = (pub) => {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(false);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(false);
      }
    };

    const onMetadataChanged = () => {
      if (participant.metadata) {
        let metadata;
        try {
          metadata = JSON.parse(participant.metadata);
        } catch (error) {
          console.error("error parsing room participant metadata", error);
        }

        metadata = {
          id: participant.identity,
          name: metadata?.name ?? "Unknown user",
          imageUrl: metadata?.imageUrl ?? null,
        };

        setMetadata(metadata);
      }
    };

    const onIsSpeakingChanged = () => {
      setSpeaking(participant.isSpeaking);
    };

    const onPublicationsChanged = () => {
      setPublications(Array.from(participant.tracks.values()));
      setSubscribedTracks(
        Array.from(participant.tracks.values()).filter((pub) => {
          return pub.isSubscribed && pub.track !== undefined;
        })
      );

      for (const pub of participant.audioTracks) {
        setAudioMuted(pub.isMuted);
        break;
      }
      for (const pub of participant.videoTracks) {
        setVideoMuted(pub.isMuted);
        break;
      }
    };

    const onConnectionQualityUpdate = () => {
      setConnectionQuality(participant.connectionQuality);
    };

    // register listeners
    participant
      .on(ParticipantEvent.TrackMuted, onMuted)
      .on(ParticipantEvent.TrackUnmuted, onUnmuted)
      .on(ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged)
      .on(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged)
      .on(ParticipantEvent.TrackPublished, onPublicationsChanged)
      .on(ParticipantEvent.TrackUnpublished, onPublicationsChanged)
      .on(ParticipantEvent.TrackSubscribed, onPublicationsChanged)
      .on(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged)
      .on(ParticipantEvent.LocalTrackPublished, onPublicationsChanged)
      .on(ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged)
      .on(ParticipantEvent.ConnectionQualityChanged, onConnectionQualityUpdate);

    // set initial state
    onMetadataChanged();
    onIsSpeakingChanged();
    onPublicationsChanged();

    return () => {
      // cleanup
      participant
        .off(ParticipantEvent.TrackMuted, onMuted)
        .off(ParticipantEvent.TrackUnmuted, onUnmuted)
        .off(ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged)
        .off(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged)
        .off(ParticipantEvent.TrackPublished, onPublicationsChanged)
        .off(ParticipantEvent.TrackUnpublished, onPublicationsChanged)
        .off(ParticipantEvent.TrackSubscribed, onPublicationsChanged)
        .off(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged)
        .off(ParticipantEvent.LocalTrackPublished, onPublicationsChanged)
        .off(ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged)
        .off(
          ParticipantEvent.ConnectionQualityChanged,
          onConnectionQualityUpdate
        );
    };
  }, [participant]);

  return {
    isLocal: participant instanceof LocalParticipant,
    isSpeaking,
    isAudioMuted,
    isVideoMuted,
    connectionQuality,
    publications,
    subscribedTracks,
    cameraPublication: participant.getTrack(Track.Source.Camera),
    microphonePublication: participant.getTrack(Track.Source.Microphone),
    screenSharePublication: participant.getTrack(Track.Source.ScreenShare),
    metadata,
  };
};
