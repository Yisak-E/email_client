import { M3Box} from "m3r";
import Sidebar from "../../components/layout/Sidebar";
import { useEmailContext } from "../../EmailContext";
import EmailView from "../inbox/EmailView";


export default function Home() {
    const {showSubNav, selectedPage} = useEmailContext();
  return (
    <M3Box  className="content-container">
      <Sidebar />

      {/* main content goes here */}
      <M3Box  color="secondary"  textAlign="center" m={0} p={2}  boxShadow={3} height={showSubNav ? 'calc(100vh - 162px)' : 'calc(100vh - 90px)'} width={"calc(100% - 300px)"} >
        {
          selectedPage === "inbox" && (
            <EmailView />
          )
        }
      </M3Box>
    </M3Box> 
  );
}