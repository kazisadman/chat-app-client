import axios from "axios";
import "./App.css";
import Routes from "./Router/Routes";
import UserContext from "./Context/UserContext";

function App() {
  axios.defaults.baseURL = "https://lets-chat-server-c44u.onrender.com";
  axios.defaults.withCredentials = true;

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <UserContext>
          <Routes></Routes>
        </UserContext>
      </div>
    </>
  );
}

export default App;
