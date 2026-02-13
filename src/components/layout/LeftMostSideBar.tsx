import { M3AppBar, M3Stack, M3FAB, M3Avatar, M3Box, M3Toolbar, M3IconButton } from "m3r";
import { MdOutlineEmail } from "react-icons/md";
import { useEmailContext } from "../../EmailContext";

export default function LeftMostSideBar() {

  const { setSelectedPage} = useEmailContext();
  return (
    <M3Stack gap={22}>
      <M3FAB >
        compose
      </M3FAB>
      <M3Stack gap={22}>
          <M3IconButton>
            <MdOutlineEmail />
          </M3IconButton>
      </M3Stack>
      
    </M3Stack>
  );
}