import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const UserContextProvider = createContext({});

const UserContext = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [Id, setId] = useState(null);

  useEffect(() => {
    axios
      .get("/profile")
      .then((res) => {
        setId(res.data.userId);
        setUserName(res.data.username);
      })
      .then((err) => console.error(err));
  }, []);

  return (
    <UserContextProvider.Provider value={{ userName, setUserName, Id, setId }}>
      {children}
    </UserContextProvider.Provider>
  );
};

UserContext.propTypes = {
  children: PropTypes.object,
};

export default UserContext;
