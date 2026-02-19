
import { M3Avatar, M3Box, M3IconButton, M3Stack, M3Typography} from "m3r";
import Home from "./pages/home/Home";
import { MdColorLens, MdDoorbell, MdLogin, MdOutlineCalendarToday, MdOutlineCreate, MdOutlineEmail, MdOutlinePerson, MdSettings, MdSunny } from "react-icons/md";
import { useEmailContext } from "./EmailContext";



function App() {
  const { isConnected, setSelectedPage } = useEmailContext();
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
            !isConnected ? (
               <M3Box
                className="segment-container"
                maxHeight={"56px"}
                maxWidth={"60px"}
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedPage("settings")}
              >
          <M3Box className={"segment-icon-container"}  >
             
              <MdLogin className="icon"/>
           
          </M3Box>
         <M3Box className={"flex flex-col items-top justify-center mt-1 w-full"}  >
             <M3Typography className="segment-label" fontSize={"12px"}>
              Settings
            </M3Typography>
          </M3Box>
        </M3Box>
            ) : (
              <M3Box className="segment-container" maxHeight={"56px"} maxWidth={"60px"}   >
          <M3Box className={"segment-icon-container"}   >
              <M3Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
                alt="Connected"
              >
                ✓
              </M3Avatar>
            </M3Box>
          <M3Box className={"flex flex-col items-top justify-center mt-1 w-full"}  >
              <M3Typography className="segment-label" fontSize={"12px"}>
              Online
            </M3Typography>
          </M3Box>
        </M3Box>
            )
        }
      </M3Stack>
     
    </M3Stack>
     <M3Box className="mini-main-container  " >
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