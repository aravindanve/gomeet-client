import { Avatar, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSessionContext } from "../../contexts/session";
import { AuthManager } from "../../services/auth";
import GoogleSignInButton from "./GoogleSignInButton";

export default function HeaderFlex() {
  const router = useRouter();
  const [sessionState] = useSessionContext();
  const [loading, setLoading] = useState(false);

  const onSignOutClick = async () => {
    setLoading(true);
    AuthManager.clear();
    router.reload();
  };

  return (
    <Flex flex={0} justifyContent="end" gap={3} mx={6} my={3}>
      {sessionState.loading ? (
        <Spinner color="purple.500" />
      ) : sessionState.user.id ? (
        <>
          <Flex>
            <Avatar
              size="sm"
              name={sessionState.user.name}
              src={sessionState.user.imageUrl}
            />
          </Flex>
          <Flex alignItems={"center"} maxWidth="30%">
            <Text noOfLines={1}>{sessionState.user.name}</Text>
          </Flex>
          <Flex alignItems={"center"}>
            <Button
              isLoading={loading}
              color={"purple.500"}
              variant="link"
              loadingText="Signing out"
              onClick={onSignOutClick}
            >
              Sign out
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <GoogleSignInButton />
        </>
      )}
    </Flex>
  );
}
