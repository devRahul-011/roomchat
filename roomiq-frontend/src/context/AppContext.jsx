import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [hasVisitedLogin, setHasVisitedLogin] = useState(false);

  return (
    <AppContext.Provider value={{ hasVisitedLogin, setHasVisitedLogin }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
