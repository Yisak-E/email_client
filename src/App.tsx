
import { M3Avatar, M3Box} from "m3r";
import Home from "./pages/home/Home";
import {  } from "@mui/material";
import { Person, Settings,  } from "@mui/icons-material";
import LeftMostSideBar from "./components/layout/LeftMostSideBar";


function App() {
  return (
   <M3Box  color="background" display="flex" flexDirection={"row"}  maxHeight="100vh" p={0} m={0} border="1px solid black" borderColor="divider">
      

       <M3Box color="secondary" display={"flex"} flexDirection={"column"} alignItems={"center"} textAlign="center" m={0}  p={0} width={64} boxShadow={3} height={"100vh"} >
         {/* side bar left most  */}
         <LeftMostSideBar />
      </M3Box>
     <M3Box display="flex" flexDirection={"column"} flex={1}  m={0} p={0} boxShadow={3} height={"100vh"} >
     {/* nav bar top most */}
      <M3Box color="primary"   textAlign="center" m={0}  p={2} height={90}  boxShadow={3} >
        <M3Box color="secondary"  display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} p={0}  >
          {/* logo */}
          <M3Box color="secondary container" fontSize={24} fontWeight="bold">
            NanoVoltz
          </M3Box>
          {/* global search */}
          <M3Box component="form"
            sx={{ display: "flex", alignItems: "center", mt: 2 }}
          >
            <M3Box color="secondary container" bgcolor={"teri"} fontSize={16} mr={1}>
              Search:
            </M3Box>
            <M3Box
              component="input"
              
              sx={{
                flex: 1,
                p: 1,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </M3Box>
          <M3Box  display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} p={0} borderRadius={4} boxShadow={3} >
            {/* user profile or settings */}
            <M3Box color="primary" fontSize={16} mr={2} display="flex" flexDirection={"column"} alignItems="center" gap={1} >
              <M3Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" sx={{ width: 40, height: 40 }}>
                 <Person /> 
              </M3Avatar>
            </M3Box>
  <M3Box color="primary" fontSize={16} mr={2} display="flex" flexDirection={"column"} alignItems="center" gap={1} > <M3Avatar alt="Settings Avatar" src="/static/images/avatar/1.jpg" sx={{ width: 40, height: 40 }}> <Settings /> </M3Avatar> </M3Box> </M3Box> </M3Box>
      </M3Box>
      <M3Box color="background"  textAlign="center" m={0}  p={0} flex={1} boxShadow={3} width="100%" height={"calc(100vh - 90px)"} >
       <Home/>
      </M3Box>

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