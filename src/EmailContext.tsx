import {createContext, useContext} from 'react';

type EmailContextType = {
    selectedEmail: any,
    setSelectedEmail: (email: any) => void,
    filter: string,
    setFilter: (filter: string) => void,
    searchTerm: string,
    setSearchTerm: (term: string) => void,
}

const EmailContext = createContext<EmailContextType>({
    selectedEmail: null,
    setSelectedEmail: () => {},
    filter: 'All',
    setFilter: () => {},
    searchTerm: '',
    setSearchTerm: () => {},
});


export const useEmailContext = () => useContext(EmailContext);

export default EmailContext;