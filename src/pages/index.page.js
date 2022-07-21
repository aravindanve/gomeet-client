import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSessionContext } from "../contexts/session";
import { makeErrorToast } from "../utils/toast";
import LayoutFlex from "./compoments/LayoutFlex";

export default function HomePage() {
  const router = useRouter();
  const toast = useToast();
  const [sessionState, sessionDispatch] = useSessionContext();
  const [joinState, setJoinState] = useState({
    inputInvalid: false,
    inputValue: "",
  });

  const onCreateClick = () => {
    // TODO: create meeting
  };

  const onJoinClick = () => {
    if (!joinState.inputValue) {
      setJoinState((state) => ({ ...state, inputInvalid: true }));
      return;
    }
    const matches = joinState.inputValue.match(/\/m\/([a-z0-9-]+)/i);
    if (matches) {
      router.push(`/m/${matches[1]}`);
    } else if (/^([a-z0-9-]+)$/i.test(joinState.inputValue)) {
      router.push(`/m/${joinState.inputValue}`);
    } else {
      setJoinState((state) => ({ ...state, inputInvalid: true }));
      toast(makeErrorToast("Invalid code or link"));
    }
  };

  return (
    <>
      <Head>
        <title>Gomeet</title>
        <meta name="description" content="Video meetings for everyone" />
      </Head>
      <LayoutFlex
        type="wide"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="center"
      >
        <Flex
          flex={1}
          direction="column"
          justifyContent="center"
          mx={[3, 6]}
          my={3}
        >
          <Box textAlign={["center", "start"]} mb={6}>
            <Heading>Gomeet</Heading>
            <Text mt={1}>Video meetings for everyone</Text>
          </Box>

          <Flex
            gap={3}
            direction={["column", "row"]}
            justifyContent={["stretch", "start"]}
          >
            <Button
              colorScheme="purple"
              leftIcon={<AddIcon />}
              flexShrink={0}
              disabled={!sessionState.user.id}
            >
              Create a meeting
            </Button>
            <Box>
              <Input
                placeholder="Code or link"
                textAlign={["center", "start"]}
                flexGrow={1}
                maxWidth={["auto", "250px"]}
                value={joinState.inputValue}
                isInvalid={joinState.inputInvalid}
                onChange={(e) =>
                  setJoinState((state) => ({
                    ...state,
                    inputInvalid: false,
                    inputValue: e.target.value,
                  }))
                }
              />
            </Box>
            <Button flexShrink={0} onClick={onJoinClick}>
              Join
            </Button>
          </Flex>
          {!sessionState.user.id ? (
            <Flex color="gray.400" mt={3}>
              You must sign in to create a meeting
            </Flex>
          ) : null}
        </Flex>
      </LayoutFlex>
    </>
  );
}
