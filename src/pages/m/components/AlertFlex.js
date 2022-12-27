import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { AlertTriangle } from "tabler-icons-react";

export default function AlertFlex({
  showDismiss = false,
  onDismiss,
  children,
  ...props
}) {
  const bg = useColorModeValue("orange.300", "orange.600");

  return (
    <Flex
      {...props}
      bg={bg}
      borderRadius="md"
      gap={1}
      px={3}
      py={2}
      fontSize="sm"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexShrink={0}>
        <AlertTriangle size={20} />
      </Flex>
      <Flex>{children}</Flex>
      {showDismiss ? (
        <Button flexShrink={0} size="xs" onClick={onDismiss}>
          Dismiss
        </Button>
      ) : null}
    </Flex>
  );
}
