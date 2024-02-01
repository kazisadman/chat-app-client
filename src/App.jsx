import axios from "axios";
import "./App.css";
import Register from "./Pages/Register";

function App() {
  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.withCredentials = true;

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Register></Register>
      </div>
    </>
  );
}

export default App;
