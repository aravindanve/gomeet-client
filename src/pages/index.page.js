import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSessionContext } from "../contexts/session";
import { MeetingAPI } from "../services/api";
import { makeErrorToast } from "../utils/toast";
import Layout from "./components/Layout";

export default function HomePage() {
  const router = useRouter();
  const toast = useToast();
  const [sessionState] = useSessionContext();
  const [joinState, setJoinState] = useState({
    inputInvalid: false,
    inputValue: "",
  });

  const onCreateMeetingClick = async () => {
    try {
      const { data: meeting } = await MeetingAPI.create();
      router.push(`/m/${meeting.code}`);
    } catch (error) {
      console.error("error retrieving meetings", error);
      toast(makeErrorToast(getErrorMessage(error)));
    }
  };

  const onJoinClick = () => {
    const inputValue = joinState.inputValue.trim();
    if (!inputValue) {
      setJoinState((state) => ({ ...state, inputInvalid: true }));
      return;
    }
    const matches = inputValue.match(/\/m\/([a-z0-9-]+)/i);
    if (matches) {
      router.push(`/m/${matches[1]}`);
    } else if (/^([a-z0-9-]+)$/i.test(inputValue)) {
      router.push(`/m/${inputValue}`);
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
      <Layout type="wide" flexDirection="column" justifyContent="center">
        <Flex
          flexGrow={1}
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
              onClick={onCreateMeetingClick}
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
              Sign in to create a meeting
            </Flex>
          ) : null}
        </Flex>
      </Layout>
    </>
  );
}
