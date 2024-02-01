import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = (e) => {
    e.preventDefault();
    console.log(username,password);
    axios
      .post("/register", { username, password })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex justify-center items-center bg-blue-100 h-screen">
      <form onSubmit={register} className="w-1/3 flex flex-col gap-4">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 rounded-lg"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 rounded-lg"
        />
        <button className="bg-blue-800 text-white p-2">Submit</button>
      </form>
    </div>
  );
};

export default Register;
