import React, { createContext, useState } from "react";

type UIContextType = {
    display : 'email' | 'calendar' | 'compose';
    setDisplay: React.Dispatch<React.SetStateAction<'email' | 'calendar' | 'compose'>>;
}

export const UIContext = createContext<UIContextType>({
    display: 'email',
    setDisplay: () => {}
});

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [display, setDisplay] = useState<'email' | 'calendar' | 'compose'>('email');
    return (
        <UIContext.Provider value={{ display, setDisplay }}>
            {children}
        </UIContext.Provider>
    );
};

