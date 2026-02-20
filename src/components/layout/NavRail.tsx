import { M3Avatar, M3Box, M3Button, M3Typography } from "m3r";
import { useEmailContext } from "../../EmailContext";
import {
  MdMail,
  MdCalendarToday,
  MdContacts,
  MdNote,
  MdSettings,
} from "react-icons/md";

const NavRail = () => {
  const { selectedPage, setSelectedPage, accountName, accountEmail } = useEmailContext();
  const displayName = accountName || (accountEmail ? accountEmail.split('@')[0] : 'Account');
  const initials = displayName
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((segment) => segment.charAt(0).toUpperCase())
		.join('') || 'A';

  const navItems = [
    { key: "inbox", label: "Email", icon: <MdMail size={20} /> },
    { key: "calendar", label: "Calendar", icon: <MdCalendarToday size={20} /> },
    { key: "contacts", label: "Contacts", icon: <MdContacts size={20} /> },
    { key: "notes", label: "Notes", icon: <MdNote size={20} /> },
  ];

  const handleNavClick = (key: string) => {
    if (key === "settings") {
      setSelectedPage("settings");
      return;
    }

    if (key === "inbox") {
      setSelectedPage("inbox");
      return;
    }

    if (key === "calendar") {
      setSelectedPage("calendar");
      return;
    }

    if (key === "contacts") {
      setSelectedPage("contacts");
      return;
    }

    if (key === "notes") {
      setSelectedPage("notes");
    }
  };

  return (
    <M3Box bgcolor="primary" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: 72, border: '3px solid #b5f30b', padding: 2 }}>
      <M3Box  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {navItems.map((item) => (
          <M3Button
            key={item.key}
            onClick={() => handleNavClick(item.key)}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 1, borderRadius: 1}}
            className ={`${selectedPage === item.key ? "bg-[#e4e8ff] text-[#2b3a6f]" : ""}`}
            aria-label={item.label}
          >
            {item.icon}
            <M3Typography variant="labelSmall" className="nav-rail-label">
              {item.label}
            </M3Typography>
          </M3Button>
        ))}
      </M3Box>
      <M3Box className="nav-rail-footer">
        <M3Button
          onClick={() => handleNavClick("settings")}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: 1, borderRadius: 1}}
          className={` ${selectedPage === "settings" ? "active" : ""}`}
          aria-label="Settings"
        >
          <MdSettings size={20} />
          <M3Typography variant="labelSmall" className="nav-rail-label">
            Settings
          </M3Typography>
        </M3Button>
        <M3Avatar className="account-avatar">{initials}</M3Avatar>
      </M3Box>
    </M3Box>
  );
};

export default NavRail;
