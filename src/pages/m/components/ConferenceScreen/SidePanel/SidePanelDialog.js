import { Flex, useColorModeValue } from "@chakra-ui/react";

export default function SidePanelDialog({ children }) {
  const bg = useColorModeValue("white", "gray.700");

  return (
    <Flex
      sx={{
        position: ["absolute", "relative"],
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      <Flex
        flexGrow={1}
        bg={bg}
        borderRadius="md"
        width="360px"
        m={2}
        ml={[2, 0]}
      >
        {children}
      </Flex>
    </Flex>
  );
}
