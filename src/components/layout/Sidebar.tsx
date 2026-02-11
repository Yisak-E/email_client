import { M3Box } from "m3r";
import type { MessageType } from "../../types/MailType";



interface SidebarProps {
  mailList: MessageType[];
}
const Sidebar = ({ mailList }: SidebarProps) => {

    
  return (
    <M3Box color="secondary" textAlign="center" mt={4} mb={4} p={2} borderRadius={4} boxShadow={3} >
      Sidebar Content
    </M3Box>
  )};

export default Sidebar;