import { M3Box} from "m3r";
import Sidebar from "../../components/layout/Sidebar";
import { useEmailContext } from "../../EmailContext";


export default function Home() {
    const {showSubNav} = useEmailContext();
  return (
    <M3Box  color="background"  height="calc(100vh - 90px)" p={0} m={0} border="1px solid red" borderColor="divider">
      {/*sub nav bar or header goes here */}
        {showSubNav && (
            <M3Box  color="tertiary40" textAlign="center" m={0} p={2}  boxShadow={3}  height={72}>
                Nav Bar / Header
            </M3Box>
        )}

      {/*side bar and main content will be contained here */}
      <M3Box  color=""  display="flex" flexDirection={"row"}  gap={2} m={0} p={0}  boxShadow={3} height={ showSubNav ? 'calc(100vh - 162px)' : 'calc(100vh - 90px)'} >
        {/* side bar goes here */}
        <M3Box  color="secondary"  textAlign="center" m={0} p={2}  boxShadow={3} height={showSubNav ? 'calc(100vh - 162px)' : 'calc(100vh - 90px)'} width={"450px"} >
          <Sidebar />
        </M3Box>

        {/* main content goes here */}
        <M3Box  color="secondary"  textAlign="center" m={0} p={2}  boxShadow={3} height={showSubNav ? 'calc(100vh - 162px)' : 'calc(100vh - 90px)'} width={"calc(100% - 450px)"} >
          Main Content
        </M3Box>
      </M3Box>
     
    </M3Box>
  );
}