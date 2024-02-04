import axios from "axios";
import { useContext, useState } from "react";
import { UserContextProvider } from "../Context/UserContext";

const RegisterandLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const { setUserName: setLoggedUserName, setId } =
    useContext(UserContextProvider);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isLogin ? "/login" : "/register";
    axios
      .post(url, { username, password })
      .then((res) => {
        console.log(res);
        setId(res.data.id);
        setLoggedUserName(username);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col justify-center items-center bg-blue-100 h-screen">
      <form onSubmit={handleSubmit} className="w-1/3 flex flex-col gap-4">
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
        <button className="bg-blue-800 text-white p-2">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      {isLogin ? (
        <div>
          Don&apos;t have an account?
          <button onClick={() => setIsLogin(false)}>Register</button> here
        </div>
      ) : (
        <div>
          Already have an account?
          <button onClick={() => setIsLogin(true)}>Login</button> here
        </div>
      )}
    </div>
  );
};

export default RegisterandLogin;
