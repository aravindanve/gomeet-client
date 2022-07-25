import MeetingInfo from "./MeetingInfo";
import Messages from "./Messages";
import Participants from "./Participants";

export default function SidePanel({
  activeSidePanelTab,
  setActiveSidePanelTab,
}) {
  return (
    <>
      <Participants
        open={activeSidePanelTab === "participants"}
        onClose={() => setActiveSidePanelTab(undefined)}
      />
      <Messages
        open={activeSidePanelTab === "messages"}
        onClose={() => setActiveSidePanelTab(undefined)}
      />
      <MeetingInfo
        open={activeSidePanelTab === "meetingInfo"}
        onClose={() => setActiveSidePanelTab(undefined)}
      />
    </>
  );
}
