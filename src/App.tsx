
import { M3Avatar, M3Box, M3IconButton, M3Stack, M3Typography} from "m3r";
import Home from "./pages/home/Home";
import {  } from "@mui/material";
import { Person, Settings,  } from "@mui/icons-material";
import { MdColorLens, MdDoorbell, MdLogin, MdOutlineCalendarToday, MdOutlineCreate, MdOutlineEmail, MdOutlinePerson, MdSettings, MdSunny } from "react-icons/md";
import { useGmail } from "./context/GmailContext";



function App() {
  const { isAuthenticated, login } = useGmail();
  return (
   <M3Box  className="main-container">
      <M3Stack className="nav-bar-contianer"  >
      <M3Box className="bg-[#dbe1ff] rounded-[16px] max-w-[56px]  " >
        <M3IconButton  className={" max-w-[56px] border-1 border-red-500"} >
          <MdOutlineCreate className="text-black w-[24px] h-[24px] "/>
        </M3IconButton>
      </M3Box>
      
      <M3Stack className="nav-bar-contianer2">
        <M3Box className="segment-container"  >
          
          <M3Box className={"segment-icon-container"} >
              <MdOutlineEmail className="icon"/>
          </M3Box>
         
             <M3Typography className="segment-label" fontSize={"12px"}>
              Email
            </M3Typography>
         
        </M3Box>
         <M3Box className="segment-container"    >
          <M3Box className={"segment-icon-container"}>
              <MdOutlineCalendarToday  className="icon"/> 
          </M3Box>

           <M3Typography className="segment-label"  fontSize={"12px"}>
              Calendar
            </M3Typography>
         
        </M3Box>
         <M3Box className="segment-container " >
            <M3Box className={"segment-icon-container"}>
              <MdOutlinePerson className="icon"/>
            </M3Box>
            <M3Typography className="segment-label" fontSize={"12px"}>
              Contacts
            </M3Typography>
        
        </M3Box>
         
      </M3Stack>
      <M3Stack className="nav-bar-contianer3">
      <M3Box>
        <MdSunny className="icon border border-gray-300"/>
      </M3Box>
       <M3Box>
        <MdDoorbell className="icon border border-gray-300" />
        </M3Box>
       <M3Box>
        <MdColorLens className="icon border border-gray-300"/>
      </M3Box>

       <M3Box>
        <MdSettings className="icon border border-gray-300"/>
      </M3Box>



        {
            !isAuthenticated ? (
               <M3Box className="segment-container" maxHeight={"56px"} maxWidth={"60px"}   >
          <M3Box className={"segment-icon-container"}  >
             
              <MdLogin className="icon"/>
           
          </M3Box>
         <M3Box className={"flex flex-col items-top justify-center mt-1 w-full"}  >
             <M3Typography className="segment-label" fontSize={"12px"}>
              Login
            </M3Typography>
          </M3Box>
        </M3Box>
            ) : (
              <M3Box className="segment-container" maxHeight={"56px"} maxWidth={"60px"}   >
          <M3Box className={"segment-icon-container"}   >
              <M3IconButton className={" max-w-[56px] border-1 border-red-500"} >
              <MdLogin className="text-green-500 w-[24px] h-[24px]  mt-[12px]"/>
            </M3IconButton>
          </M3Box>
          <M3Box className={"flex flex-col items-top justify-center mt-1 w-full"}  >
              <M3Typography className="segment-label" fontSize={"12px"}>
              Authenticated
            </M3Typography>
          </M3Box>
        </M3Box>
            )
        }
      </M3Stack>
     
    </M3Stack>
     <M3Box className="mini-main-container border " >
     {/* nav bar top most */}
      <M3Box className="top-nav-bar-container" >
       
      
          <M3Box className="logo-container"  >
            NanoVoltz
          </M3Box>
          {/* global search */}
          <M3Box className="global-search-container" >
            <M3Typography className="global-search-placeholder" >
              Search Mail
            </M3Typography>
          </M3Box>
          </M3Box>
 
          {/* main content container */}
          <Home />
          
          </M3Box>

     

    
    
   </M3Box>
  );
}

export default App;


/**
 *.
├── M3Accordion
│   ├── M3Accordion.d.ts
│   ├── M3AccordionActions.d.ts
│   ├── M3AccordionDetails.d.ts
│   ├── M3AccordionSummary.d.ts
│   └── index.d.ts
├── M3Alert
│   ├── M3Alert.d.ts
│   ├── M3AlertTitle.d.ts
│   └── index.d.ts
├── M3AppBar
│   ├── M3AppBar.d.ts
│   ├── M3Toolbar.d.ts
│   └── index.d.ts
├── M3Autocomplete
│   ├── M3Autocomplete.d.ts
│   └── index.d.ts
├── M3Avatar
│   ├── M3Avatar.d.ts
│   └── index.d.ts
├── M3Badge
│   ├── M3Badge.d.ts
│   └── index.d.ts
├── M3Button
│   ├── M3Button.d.ts
│   └── index.d.ts
├── M3Card
│   ├── M3Card.d.ts
│   ├── M3CardActionArea.d.ts
│   ├── M3CardActions.d.ts
│   ├── M3CardContent.d.ts
│   ├── M3CardHeader.d.ts
│   ├── M3CardMedia.d.ts
│   └── index.d.ts
├── M3Checkbox
│   ├── M3Checkbox.d.ts
│   └── index.d.ts
├── M3Chip
│   ├── M3Chip.d.ts
│   └── index.d.ts
├── M3Containers
│   ├── M3Box.d.ts
│   ├── M3Paper.d.ts
│   ├── M3Stack.d.ts
│   └── index.d.ts
├── M3DatePicker
│   ├── M3AdapterDayjs.d.ts
│   ├── M3DatePicker.d.ts
│   ├── M3Dayjs.d.ts
│   ├── M3DesktopDatePicker.d.ts
│   ├── M3LocalizationProvider.d.ts
│   ├── M3MobileDatePicker.d.ts
│   ├── M3StaticDatePicker.d.ts
│   └── index.d.ts
├── M3Dialog
│   ├── M3Dialog.d.ts
│   ├── M3DialogActions.d.ts
│   ├── M3DialogContent.d.ts
│   ├── M3DialogContentText.d.ts
│   ├── M3DialogTitle.d.ts
│   └── index.d.ts
├── M3Divider
│   ├── M3Divider.d.ts
│   └── index.d.ts
├── M3Drawer
│   ├── M3Drawer.d.ts
│   └── index.d.ts
├── M3FAB
│   ├── M3FAB.d.ts
│   └── index.d.ts
├── M3Form
│   ├── M3FormControlLabel.d.ts
│   └── index.d.ts
├── M3IconButton
│   ├── M3IconButton.d.ts
│   └── index.d.ts
├── M3IconMenuItem
│   ├── M3IconMenuItem.d.ts
│   └── index.d.ts
├── M3List
│   ├── M3List.d.ts
│   └── index.d.ts
├── M3ListItem
│   ├── M3ListItem.d.ts
│   └── index.d.ts
├── M3ListItemAvatar
│   ├── M3ListItemAvatar.d.ts
│   └── index.d.ts
├── M3ListItemIcon
│   ├── M3ListItemIcon.d.ts
│   └── index.d.ts
├── M3ListItemText
│   ├── M3ListItemText.d.ts
│   └── index.d.ts
├── M3Menu
│   ├── M3Menu.d.ts
│   └── index.d.ts
├── M3MenuItem
│   ├── M3MenuItem.d.ts
│   └── index.d.ts
├── M3NestedMenuItem
│   ├── M3NestedMenuItem.d.ts
│   └── index.d.ts
├── M3Radio
│   ├── M3Radio.d.ts
│   └── index.d.ts
├── M3Search
│   ├── M3Search.d.ts
│   └── index.d.ts
├── M3SideSheet
│   ├── M3SideSheet.d.ts
│   ├── M3SideSheetActions.d.ts
│   └── index.d.ts
├── M3Switch
│   ├── M3Switch.d.ts
│   └── index.d.ts
├── M3Tab
│   ├── M3Tab.d.ts
│   └── index.d.ts
├── M3Table
│   ├── M3Table.d.ts
│   └── index.d.ts
├── M3Tabs
│   ├── M3Tabs.d.ts
│   └── index.d.ts
├── M3TextField
│   ├── M3TextField.d.ts
│   └── index.d.ts
├── M3TimePicker
│   ├── M3DesktopTimePicker.d.ts
│   ├── M3MobileTimePicker.d.ts
│   ├── M3StaticTimePicker.d.ts
│   ├── M3TimePicker.d.ts
│   └── index.d.ts
├── M3ToggleButton
│   ├── M3ToggleButton.d.ts
│   ├── M3ToggleButtonGroup.d.ts
│   └── index.d.ts
├── M3Tooltip
│   ├── M3Tooltip.d.ts
│   └── index.d.ts
├── M3Transitions
│   ├── M3Slide.d.ts
│   └── index.d.ts
├── M3Typography
│   ├── M3Typography.d.ts
│   └── index.d.ts
└── index.d.ts
 */