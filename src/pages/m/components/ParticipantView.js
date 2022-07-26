import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MicrophoneOff } from "tabler-icons-react";
import AspectBox from "../../components/AspectBox";

export default function ParticipantView({
  name,
  imageUrl,
  track,
  isMuted,
  isLocal,
  isPreview,
}) {
  const bg = useColorModeValue("gray.100", "gray.900");
  const [videoEl, setVideoEl] = useState();

  const isFrontFacing =
    isLocal &&
    track?.mediaStreamTrack?.getSettings().facingMode !== "environment";

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
      aspectRatio={1}
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
        />
      </Flex>
      {!track ? (
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
        <Flex
          position={"absolute"}
          right="0"
          bottom="0"
          left="0"
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            background="blackAlpha.300"
            borderRadius="md"
            alignItems="center"
            px={2}
            py={0.5}
            m={3}
          >
            {isMuted ? (
              <Flex mr={1} color="red">
                <MicrophoneOff size={16} />
              </Flex>
            ) : null}

            <Text noOfLines={1} fontSize="sm">
              Aravindan Ve
            </Text>
          </Flex>
        </Flex>
      ) : null}
    </AspectBox>
  );
}
