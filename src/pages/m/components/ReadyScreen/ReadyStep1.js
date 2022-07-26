import {
  Avatar,
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMeetingContext } from "../../../../contexts/meeting";
import { useSessionContext } from "../../../../contexts/session";
import TrackDetails from "../TrackDetails";

export default function ReadyStep1({ joinData, onJoinClick }) {
  const router = useRouter();
  const [sessionState] = useSessionContext();
  const [meetingState] = useMeetingContext();
  const [joinState, setJoinState] = useState({
    inputInvalid: false,
    inputValue: joinData.name ?? "",
  });

  const admin = meetingState.meeting.userId === sessionState.user.id;

  const _onJoinClick = () => {
    if (sessionState.user.id) {
      onJoinClick({
        name: sessionState.user.name ?? "Unknown user",
      });
    } else {
      const inputValue = joinState.inputValue.trim();
      if (!inputValue) {
        setJoinState((state) => ({ ...state, inputInvalid: true }));
        return;
      }
      onJoinClick({ name: inputValue });
    }
  };

  return (
    <Flex flexGrow={1} direction="column" justifyContent="center" gap={6}>
      <Box width="100%">
        {sessionState.user.id ? (
          <>
            <Flex gap={3} justifyContent={["center", "start"]}>
              <Flex>
                <Avatar
                  size="md"
                  name={sessionState.user.name}
                  src={sessionState.user.imageUrl}
                />
              </Flex>
              <Flex alignItems={"center"} maxWidth="30%">
                <Text fontWeight="semibold" noOfLines={1}>
                  {sessionState.user.name}
                </Text>
              </Flex>
            </Flex>
          </>
        ) : (
          <>
            <FormLabel textAlign={["center", "start"]}>
              What&rsquo;s your name?
            </FormLabel>
            <Input
              placeholder="Your name"
              textAlign={["center", "start"]}
              flexGrow={1}
              width="100%"
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
          </>
        )}
      </Box>
      <Box width="100%">
        <TrackDetails />
      </Box>
      <Box width="100%" textAlign={["center", "start"]}>
        <Button
          flexShrink={0}
          colorScheme="purple"
          mr={3}
          onClick={_onJoinClick}
        >
          {admin ? "Join Meeting" : "Ask to Join"}
        </Button>
        <Button flexShrink={0} onClick={() => router.push("/")}>
          Back to home
        </Button>
      </Box>
    </Flex>
  );
}
