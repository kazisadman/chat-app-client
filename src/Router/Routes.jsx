import { useContext } from "react";
import Register from "../Pages/Register";
import { UserContextProvider } from "../Context/UserContext";

const Routes = () => {
  const { userName, Id } = useContext(UserContextProvider);

  if (userName) {
    return "loggedIn: " + userName;
  }
  return (
    <div>
      <Register></Register>
    </div>
  );
};

export default Routes;
