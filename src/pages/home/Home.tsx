import { M3Box} from "m3r";
import Sidebar from "../../components/layout/Sidebar";
import { useEmailContext } from "../../EmailContext";
import EmailView from "../inbox/EmailView";
import Settings from "../settings/Settings";


export default function Home() {
    const {showSubNav, selectedPage} = useEmailContext();
  return (
    <M3Box  className="content-container">
      <Sidebar />

      {/* main content goes here */}
      <M3Box  maxHeight={showSubNav ? 'calc(100vh - 162px)' : 'calc(100vh - 90px)'} width={"calc(100% - 300px)"} sx={{flex: 1, overflow: 'auto'}} >
        {
          selectedPage === "inbox" && (
            <EmailView />
          )
        }
        {
          selectedPage === "settings" && (
            <Settings />
          )
        }
      </M3Box>
    </M3Box> 
  );
}