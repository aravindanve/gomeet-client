import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { MicrophoneOff } from "tabler-icons-react";

export default function TrackLabel({ name, isLocal, isAudioMuted }) {
  const bg = useColorModeValue("whiteAlpha.800", "blackAlpha.800");

  return (
    <Flex
      position={"absolute"}
      right="0"
      bottom="0"
      left="0"
      justifyContent="center"
      alignItems="center"
    >
      <Flex bg={bg} borderRadius="md" alignItems="center" px={2} py={0.5} m={3}>
        {isAudioMuted ? (
          <Flex mr={1} color="red.400">
            <MicrophoneOff size={16} />
          </Flex>
        ) : null}

        <Text noOfLines={1} fontSize="sm">
          {name}
          {isLocal ? " (You)" : ""}
        </Text>
      </Flex>
    </Flex>
  );
}
