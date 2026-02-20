import { M3Avatar, M3Box, M3Typography } from "m3r";
import { useEmailContext } from "../../EmailContext";
import {
  MdMail,
  MdCalendarToday,
  MdContacts,
  MdNote,
  MdSettings,
  MdPerson,
} from "react-icons/md";

const NavRail = () => {
  const { selectedPage, setSelectedPage } = useEmailContext();

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
    <M3Box className="nav-rail">
      <M3Box className="nav-rail-group">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleNavClick(item.key)}
            className={`nav-rail-item ${selectedPage === item.key ? "active" : ""}`}
            aria-label={item.label}
          >
            {item.icon}
            <M3Typography variant="labelSmall" className="nav-rail-label">
              {item.label}
            </M3Typography>
          </button>
        ))}
      </M3Box>
      <M3Box className="nav-rail-footer">
        <button
          type="button"
          onClick={() => handleNavClick("settings")}
          className={`nav-rail-item ${selectedPage === "settings" ? "active" : ""}`}
          aria-label="Settings"
        >
          <MdSettings size={20} />
          <M3Typography variant="labelSmall" className="nav-rail-label">
            Settings
          </M3Typography>
        </button>
        <M3Avatar className="nav-rail-avatar">
          <MdPerson size={18} />
        </M3Avatar>
      </M3Box>
    </M3Box>
  );
};

export default NavRail;
