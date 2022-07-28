import { Flex, Grid } from "@chakra-ui/react";
import { Fragment } from "react";
import { useWindowSize } from "usehooks-ts";
import ParticipantView from "../../ParticipantView";

export default function GridView({ participants }) {
  const { width, height } = useWindowSize();

  let [cols, rows] =
    participants.length == 1
      ? [1, 1]
      : participants.length == 2
      ? [2, 1]
      : participants.length <= 4
      ? [2, 2]
      : participants.length <= 6
      ? [3, 2]
      : participants.length <= 9
      ? [3, 3]
      : participants.length <= 12
      ? [4, 3]
      : [4, 4];

  if (height > width) {
    [rows, cols] = [cols, rows];
  }

  const lastRowStart = (rows - 1) * cols;
  const lastRowOffset = cols * rows - participants.length;

  return (
    <Grid
      width="100%"
      height="100%"
      templateRows={`repeat(${rows * 2}, 1fr)`}
      templateColumns={`repeat(${cols * 2}, 1fr)`}
      gap={2}
      p={2}
    >
      {participants.map((it, i) => (
        <Fragment key={i}>
          {i == lastRowStart && lastRowOffset ? (
            <Flex gridRow="span 2" gridColumn={`span ${lastRowOffset}`} />
          ) : null}
          <Flex gridRow="span 2" gridColumn="span 2">
            <ParticipantView participant={it} />
          </Flex>
        </Fragment>
      ))}
    </Grid>
  );
}
