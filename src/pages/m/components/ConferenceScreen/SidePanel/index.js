import { Flex, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import Messages from "./Messages";

export default function SidePanel() {
  const bg = useColorModeValue("white", "gray.700");
  const sx = useBreakpointValue({
    base: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    md: {
      position: "relative",
    },
  });

  return (
    <Flex sx={sx}>
      <Flex flexGrow={1} bg={bg} borderRadius="md" width="360px" m={3}>
        <Messages />
      </Flex>
    </Flex>
  );
}
