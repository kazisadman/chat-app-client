import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "../Components/Avatar";
import { UserContextProvider } from "../Context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);

  const { Id } = useContext(UserContextProvider);

  useEffect(() => {
    connetToWs();
  }, []);

  //reconnect to websocket
  function connetToWs() {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Websocket disconnected,trying to reconnect");
        connetToWs();
      }, 1000);
    });
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [
        ...prev,
        {
          _id: messageData._id,
          text: messageData.text,
          sender: messageData.sender,
          recipient: messageData.recipent,
        },
      ]);
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, userName }) => {
      people[userId] = userName;
    });
    setOnlinePeople(people);
  }

  //load messages from database
  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`messages/${selectedUserId}`)
        .then((res) => setMessages(res.data));
    }
  }, [selectedUserId]);

  function selectedUser(userId) {
    setSelectedUserId(userId);
  }

  const onlinePeopleExcludingSelf = { ...onlinePeople };
  delete onlinePeopleExcludingSelf[Id];

  function handleSendMessage(e) {
    e.preventDefault();

    const data = {
      recipent: selectedUserId,
      text: newMessage,
    };

    const dataStringify = JSON.stringify(data);
    ws.send(dataStringify);

    setNewMessage("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: Id,
        recipent: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }

  const messegesWithoutDuplicates = uniqBy(messages, "_id");

  const scrollBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  return (
    <div className=" flex h-screen max-w-7xl mx-auto font-poppins">
      <div className="bg-white w-1/3 pl-4 py-3">
        <div className="font-bold text-blue-700 flex items-center gap-2 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
              clipRule="evenodd"
            />
          </svg>
          LET&apos;Schat
        </div>
        {Object.keys(onlinePeopleExcludingSelf).map((userId) => (
          <div
            key={userId}
            className={`flex items-center gap-2 py-2  cursor-pointer ${
              userId === selectedUserId && "bg-blue-100  pl-2 rounded-s-2xl"
            }`}
            onClick={() => selectedUser(userId)}
          >
            <Avatar userName={onlinePeople[userId]} userId={userId}></Avatar>
            {onlinePeople[userId]}
          </div>
        ))}
      </div>
      <div className=" overflow-y-scroll flex flex-col bg-blue-100 w-2/3 px-4 py-3">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex justify-center h-full items-center">
              <div className="text-gray-400">No Message To Show</div>
            </div>
          )}
          {selectedUserId && (
            <div>
              {messegesWithoutDuplicates.map((message, index) => {
                const isMessageForSelectedUser =
                   message.sender === selectedUserId ||
                  message.recipent === selectedUserId;
                if (isMessageForSelectedUser) {
                  return (
                    <div
                      className={`${
                        message.sender === Id ? "text-right" : "text-left"
                      }`}
                      key={index}
                    >
                      <div
                        className={`${
                          message.sender === Id
                            ? "bg-blue-600 text-white"
                            : "bg-blue-400 text-white"
                        } rounded-lg my-4 p-3 inline-block max-w-xs text-justify `}
                      >
                        {message.text}
                      </div>
                    </div>
                  );
                } 
              })}
              <div ref={messageContainerRef}></div>
            </div>
          )}
        </div>

        {selectedUserId && (
          <form
            className="flex items-center gap-2"
            onSubmit={handleSendMessage}
          >
            <input
              value={newMessage}
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type Your Message Here"
              className="flex-grow border-none p-2 rounded-lg"
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-lg"
              disabled={newMessage.length === 0}
            >
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
