import { Flex, Heading, IconButton } from "@chakra-ui/react";
import { X } from "tabler-icons-react";
import Tooltip from "../../../../components/Tooltip";
import SidePanelDialog from "./SidePanelDialog";

export default function MeetingInfo({ open, onClose }) {
  return open ? (
    <SidePanelDialog>
      <Flex flexGrow={1} direction="column">
        <Flex alignItems="center" gap={3} mx={3} my={2}>
          <Heading flexGrow={1} fontWeight="normal" size="md">
            Meeting Info
          </Heading>
          <Flex>
            <Tooltip text="Close">
              <IconButton
                variant="ghost"
                isRound
                icon={<X />}
                mr={-2}
                onClick={onClose}
              />
            </Tooltip>
          </Flex>
        </Flex>
        <Flex flexGrow={1} justifyContent="center" alignItems="center">
          Meeting Info
        </Flex>
      </Flex>
    </SidePanelDialog>
  ) : null;
}
