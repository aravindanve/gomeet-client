import { Avatar, Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AspectBox from "../../components/AspectBox";
import TrackLabel from "./TrackLabel";

export default function TrackView({
  name,
  imageUrl,
  track,
  isAudioMuted,
  isVideoMuted,
  isLocal,
  isPreview,
  aspectRatio = 1,
}) {
  const bg = useColorModeValue("gray.100", "gray.900");
  const [videoEl, setVideoEl] = useState();

  const isFrontFacing =
    isLocal &&
    track?.mediaStreamTrack?.getSettings().facingMode !== "environment";

  const isVideoShown = track && !isVideoMuted;

  useEffect(() => {
    if (!videoEl || !track) {
      return;
    }

    videoEl.muted = true;
    track.attach(videoEl);
    return () => {
      track.detach(videoEl);
    };
  }, [track, videoEl]);

  return (
    <AspectBox
      bg={bg}
      aspectRatio={aspectRatio}
      width="100%"
      borderRadius="lg"
      overflow="hidden"
    >
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Box
          as="video"
          ref={setVideoEl}
          width="100%"
          height="100%"
          transform={isLocal && isFrontFacing ? "rotateY(180deg)" : ""}
          objectFit="cover"
          visibility={isVideoShown ? "visible" : "hidden"}
        />
      </Flex>
      {!isVideoShown ? (
        <Flex
          position={"absolute"}
          top="0"
          right="0"
          bottom="0"
          left="0"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar size="lg" name={name} src={imageUrl} />
        </Flex>
      ) : null}
      {!isPreview ? (
        <TrackLabel name={name} isAudioMuted={isAudioMuted} />
      ) : null}
    </AspectBox>
  );
}
