import { useEffect, useState } from "react";

const Chat = () => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function handleMessage(e) {
    console.log("message received", e);
  }

  return (
    <div className="flex h-screen max-w-7xl mx-auto font-poppins">
      <div className="bg-white w-1/3 px-4 py-3">contact</div>
      <div className="flex flex-col bg-blue-100 w-2/3 px-4 py-3">
        <div className="flex-grow">Message with selected person</div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type Your Message Here"
            className="flex-grow border-none p-2 rounded-lg"
          />
          <button className="bg-blue-500 text-white p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
