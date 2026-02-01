import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppsProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userImagePath, setUserImagePath] = useState(null);
  const [func, setFunc] = useState(null);

  const userName = useMemo(() => {
    return `${userFirstName} ${userLastName}`;
  }, [userFirstName, userLastName]);

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        userFirstName,
        setUserFirstName,
        userLastName,
        setUserLastName,
        userEmail,
        setUserEmail,
        userImagePath,
        setUserImagePath,
        userName,
        func,
        setFunc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
