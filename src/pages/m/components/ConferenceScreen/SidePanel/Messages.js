import { Flex, Heading, IconButton, Tooltip } from "@chakra-ui/react";
import { X } from "tabler-icons-react";

export default function Messages() {
  return (
    <Flex flexGrow={1} direction="column">
      <Flex alignItems="center" gap={3} mx={3} my={2}>
        <Heading flexGrow={1} fontWeight="normal" size="md">
          Messages
        </Heading>
        <Flex>
          <Tooltip label="Close">
            <IconButton variant="ghost" isRound icon={<X />} />
          </Tooltip>
        </Flex>
      </Flex>
      <Flex flexGrow={1} justifyContent="center" alignItems="center">
        Messages
      </Flex>
    </Flex>
  );
}
