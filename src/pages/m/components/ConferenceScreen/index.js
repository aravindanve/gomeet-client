import { Flex, useColorModeValue } from "@chakra-ui/react";
import Layout from "../../../components/Layout";
import ControlBar from "./ControlBar";
import SidePanel from "./SidePanel";
import Stage from "./Stage";

export default function ConferenceScreen() {
  const bg = useColorModeValue("gray.300", "gray.900");

  // TODO:
  // participant count
  // speaker vs grid mode
  // participant panel
  // chat panel
  // screen share

  return (
    <Layout bg={bg} flexDirection="column" header={null} footer={null}>
      <Flex position="relative" flexGrow="1">
        <Stage />
        <SidePanel />
      </Flex>
      <ControlBar />
    </Layout>
  );
}
