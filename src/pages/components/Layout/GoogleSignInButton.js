import { Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleSignInButton(props) {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [parentEl, setParentEl] = useState(null);

  // init and render button
  useEffect(() => {
    if (!scriptLoaded || !parentEl) {
      return;
    }
    google.accounts.id.setLogLevel("info");
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      login_uri:
        "http://localhost:3000/signin?next=" +
        encodeURIComponent(router.asPath),
      ux_mode: "redirect",
    });

    google.accounts.id.renderButton(parentEl, {
      theme: "outline",
      text: "signin_with",
    });
  }, [parentEl, router.asPath, scriptLoaded]);

  useEffect(() => {
    if (typeof google !== "undefined") {
      // onLoad is not triggered on going back
      setScriptLoaded(true);
    }
  }, []);

  return (
    <>
      <Flex
        {...props}
        ref={setParentEl}
        height="40px"
        my="-4px"
        overflow="hidden"
        borderRadius="5px"
        alignItems="center"
      >
        <Spinner color="purple.500" my="4px" />
      </Flex>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setScriptLoaded(true)}
      />
    </>
  );
}
