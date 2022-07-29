import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import Layout from "../../../components/Layout";
import ControlBar from "./ControlBar";
import SidePanel from "./SidePanel";
import Stage from "./Stage";

export default function ConferenceScreen() {
  const bg = useColorModeValue("gray.300", "gray.800");
  const [activeSidePanelTab, setActiveSidePanelTab] = useState();

  // TODO:
  // show track errors
  // participant count
  // speaker vs ~grid mode~
  // participant panel
  // chat panel
  // screen share
  // signal stats

  return (
    <Layout bg={bg} flexDirection="column" header={null} footer={null}>
      <Flex position="relative" flexGrow="1">
        <Stage />
        <SidePanel
          activeSidePanelTab={activeSidePanelTab}
          setActiveSidePanelTab={setActiveSidePanelTab}
        />
      </Flex>
      <ControlBar
        activeSidePanelTab={activeSidePanelTab}
        setActiveSidePanelTab={setActiveSidePanelTab}
      />
    </Layout>
  );
}
