import axios from "axios";
import "./App.css";
import Routes from "./Router/Routes";
import UserContext from "./Context/UserContext";

function App() {
  axios.defaults.baseURL = "http://localhost:5000";
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
