import { useContext } from "react";
import RegisterandLogin from "../Pages/Register&Login";
import { UserContextProvider } from "../Context/UserContext";
import Chat from "../Pages/Chat";

const Routes = () => {
  const { userName } = useContext(UserContextProvider);

  if (userName) {
    return <Chat></Chat>;
  }
  return (
    <div className="font-poppins">
      <RegisterandLogin></RegisterandLogin>
    </div>
  );
};

export default Routes;
