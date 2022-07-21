import { Flex, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AuthManager } from "../../services/auth";
import LayoutFlex from "./LayoutFlex";
import WrappedLink from "./WrappedLink";

export default function LayoutError({
  message,
  showRefresh = false,
  showSignOut = false,
  showBackToHome = true,
}) {
  const router = useRouter();

  return (
    <LayoutFlex alignItems="center" justifyContent="center">
      <Flex direction="column" alignItems="center" gap={3}>
        <Text color={"red.500"} fontWeight="bold" fontSize={"xl"}>
          {message}
        </Text>
        <Flex gap={3}>
          {showRefresh ? (
            <Link color={"red.500"} onClick={() => router.reload()}>
              Refresh
            </Link>
          ) : null}
          {showSignOut ? (
            <Link
              color={"red.500"}
              onClick={() => {
                AuthManager.clear();
                router.reload();
              }}
            >
              Sign out
            </Link>
          ) : null}
          {showBackToHome ? (
            <WrappedLink color={"red.500"} href="/">
              Back to home
            </WrappedLink>
          ) : null}
        </Flex>
      </Flex>
    </LayoutFlex>
  );
}
