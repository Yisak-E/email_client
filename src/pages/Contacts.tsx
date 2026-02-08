import { 
    Box,
    List,
    ListItem,
    Typography,
    Avatar,
    ListItemAvatar,


} from "@mui/material";
import React from "react";
import messagesData from '../../public/data/messages.json';

type ContactType = {
    id: number | string,
    name: string,
    email: string
}


const Contacts = () => {

    const [contacts, setContacts] = React.useState<ContactType[]>([]);

    React.useEffect(() => {
        // Simulate fetching contacts from an API
        const fetchContacts = async () => {
            // Simulated delay
            await new Promise(resolve => setTimeout(resolve, 100));
            // Simulated contact data
            const simulatedContacts = messagesData.emails.map(email => ({
                id: email.id,
                name: email.sender,
                email: `${email.sender.toLowerCase().replace(/\s/g, '.')}@example.com`
            }));
            setContacts(simulatedContacts);
        };

        fetchContacts();
    }, []);

  return (
       <Box className=" flex justify-between h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
        <Box className="w-1/4 flex flex-col px-4 py-0">
            <List className="divide-y divide-gray-200 overflow-y-scroll h-screen w-full">
                 <Typography variant="h2" fontSize={'large'} className=" font-semibold mb-4">Contacts</Typography>
                {contacts.map(contact => (
                    <ListItem key={contact.id} className="py-2 flex items-center gap-1">
                          <ListItemAvatar>
                            <Avatar 
                                src={`https://i.pravatar.cc/150?u=${contact.id}`} 
                                className="w-10 h-10 border-2 border-white shadow-sm"
                            />
                          </ListItemAvatar>
                        <Box>
                            <Typography className="text-lg font-medium" fontSize={'medium'}>{contact.name}</Typography>
                            <Typography className="text-sm text-gray-500" fontSize={'small'}>{contact.email}</Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
        <Box className="flex-1 p-4" >
            <Box className="h-full flex flex-col items-center justify-center text-center px-4 bg-gray-300">
                <Typography variant="h4" className="font-bold mb-2 text-gray-700">
                    Select a contact to view details
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                    Your contacts will appear here. Click on a contact to see more information.
                </Typography>
            </Box>
        </Box>


    </Box>
  );
};

export default Contacts;