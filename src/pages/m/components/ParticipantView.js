import { Flex, useColorModeValue } from "@chakra-ui/react";
import AspectBox from "../../components/AspectBox";

export default function ParticipantView() {
  const bg = useColorModeValue("gray.100", "gray.900");
  return (
    <AspectBox bg={bg} width="100%" borderRadius="lg">
      <Flex justifyContent="center" alignItems="center" height="100%">
        Participant View
        {/* TODO */}
      </Flex>
    </AspectBox>
  );
}
