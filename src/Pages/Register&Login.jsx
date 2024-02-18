import axios from "axios";
import { useContext, useState } from "react";
import { UserContextProvider } from "../Context/UserContext";

const RegisterandLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");

  const { setUserName: setLoggedUserName, setId } =
    useContext(UserContextProvider);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const url = isLogin ? "/login" : "/register";

    if (password.length < 6) {
      setError("Password should be ateast 6 characters");
    } else {
      axios
        .post(url, { username, password })
        .then((res) => {
          console.log(res);
          setId(res.data.id);
          setLoggedUserName(username);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setError("Username or Password not matched");
          }
        });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-blue-100 h-screen">
      {isLogin ? (
        <div className="text-blue-700 font-bold mb-6 text-3xl">Login</div>
      ) : (
        <div className="text-blue-700 font-bold mb-6 text-3xl">Register</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-1/3 flex flex-col gap-4 bg-white p-6 rounded-lg mb-3"
      >
        <input
          type="text"
          onChange={(e) => {
            const userName = e.target.value;
            const userNameCapital =
              userName.charAt(0).toUpperCase() + userName.slice(1);
            setUsername(userNameCapital);
          }}
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
        {error && <div>{error}</div>}
      </form>

      {isLogin ? (
        <div>
          Don&apos;t have an account?
          <button className="bg-blue" onClick={() => setIsLogin(false)}>
            Register
          </button>{" "}
          here
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
