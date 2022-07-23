import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSessionContext } from "../../../contexts/session";
import { AuthManager } from "../../../services/auth";
import GoogleSignInButton from "./GoogleSignInButton";

export default function Header() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [sessionState] = useSessionContext();
  const [loading, setLoading] = useState(false);

  const onSignOutClick = async () => {
    setLoading(true);
    AuthManager.clear();
    router.reload();
  };

  return (
    <Flex
      flex={0}
      justifyContent="end"
      alignItems="center"
      gap={3}
      height="32px"
      mx={6}
      my={3}
    >
      <Button
        variant="ghost"
        leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        height="40px"
        my="-4px"
      >
        Mode
      </Button>
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
            <Text fontWeight="semibold" noOfLines={1}>
              {sessionState.user.name}
            </Text>
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
