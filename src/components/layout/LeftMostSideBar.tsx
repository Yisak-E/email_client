import { M3AppBar, M3Avatar, M3Box, M3Toolbar } from "m3r";
import { Person, Settings, Create, Mail } from "@mui/icons-material";
import { useEmailContext } from "../../EmailContext";

export default function LeftMostSideBar() {

  const { setSelectedPage} = useEmailContext();
  return (
    <M3AppBar position="static" className="bg-purple-300" sx={{ width: 40, height: "calc(100vh - 90px)", boxShadow: 3 }}>
      <M3Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        {/* Icons or buttons for navigation */}
          <M3Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
            <M3Box color="primary" fontSize={16} mr={2}>
                <M3Avatar 
                onClick={()=>{
                  setSelectedPage("newMail");
                }}
                alt="newMail" src="/static/images/avatar/1.jpg" sx={{ width: 30, height: 30, marginBottom: 2 }} >
                  <Create className="text-purple-500" />
                </M3Avatar>
                <M3Avatar 
                onClick={()=>{
                  setSelectedPage("inbox");
                }}
                color="secondary" alt="Sent" src=" " sx={{ width: 30, height: 30 , marginBottom: 2 }} >
                  <Mail className="text-purple-500" />
                </M3Avatar>
            </M3Box>
          
          </M3Box>
          <M3Box color="primary" fontSize={16} mr={2}>
              <M3Avatar alt="Drafts" src="/static/images/avatar/1.jpg" sx={{ width: 30, height: 30, marginBottom: 2 }} >
                <Person color="secondary" />
              </M3Avatar>
              <M3Avatar alt="Trash" src="/static/images/avatar/1.jpg" sx={{ width: 30, height: 30 , marginBottom: 2 }} >
                <Settings color="secondary" />
              </M3Avatar>
            </M3Box>
          
      </M3Toolbar>
     </M3AppBar>
  );
}