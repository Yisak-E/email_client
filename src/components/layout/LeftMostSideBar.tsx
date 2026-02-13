import { M3Stack, M3FAB, M3Box, M3IconButton, M3Button } from "m3r";
import { MdOutlineEmail, MdLogin } from "react-icons/md";
import { useGmail } from "../../context/GmailContext";

export default function LeftMostSideBar() {
  const { isAuthenticated, login } = useGmail();

  return (
    <M3Stack gap={22}>
      {!isAuthenticated ? (
        <M3Button onClick={login} variant="filled">
          <MdLogin style={{ marginRight: 8 }} />
          Login
        </M3Button>
      ) : (
        <M3Box>
          <div style={{ fontSize: 12, color: "green" }}>✓ Authenticated</div>
        </M3Box>
      )}
      
      <M3FAB>
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