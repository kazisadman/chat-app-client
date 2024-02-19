import { useContext, useEffect, useRef, useState } from "react";
import { UserContextProvider } from "../Context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Users from "../Components/Users";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [offlinePeople, setofflinePeople] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);


  const { userName, Id } = useContext(UserContextProvider);

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
          file: messageData.fileUrl,
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

  function handleSendMessage(e, file = null) {
    if (e) e.preventDefault();
    console.log(file);

    const data = {
      recipent: selectedUserId,
      text: newMessage,
      file,
    };

    console.log(data);

    const dataStringify = JSON.stringify(data);
    ws.send(dataStringify);

    setNewMessage("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: Id,
        file: file?.url,
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

  function sendFlie(e) {
    const imageToast = document.getElementById("image-toast");
    const imageUrl = `https://api.imgbb.com/1/upload?key=4d2547e7bd3e3e8994fc5ce8fec358bc`;

    const uploadFileExtension = e.target.files[0].name
      .split(".")[1]
      .toLowerCase();
    const image = e.target.files[0];
    const imageFile = { image: image };
    if (
      uploadFileExtension === "jpeg" ||
      uploadFileExtension === "jpg" ||
      uploadFileExtension === "png"
    ) {
      axios
        .post(imageUrl, imageFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: false,
        })
        .then((res) => {
          handleSendMessage(null, {
            name: res.data.data.title,
            url: res.data.data.url,
          });
        })
        .catch((err) => console.error(err));
    } else {
      imageToast.classList.remove("hidden");
      setTimeout(() => {
        imageToast.classList.add("hidden");
      }, 3000);
    }
  }

  useEffect(() => {
    axios.get("/users").then((res) => {
      const offlineUsersArr = res.data
        .filter((u) => u._id !== Id)
        .filter((u) => !Object.keys(onlinePeople).includes(u._id));
      const offlineUsers = {};
      offlineUsersArr.forEach((u) => {
        offlineUsers[u._id] = u.username;
      });
      setofflinePeople(offlineUsers);
    });
  }, [onlinePeople, Id]);

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  function handleLogOut() {
    axios.post("/logout").then(() => {
      setWs(null);
      location.reload();
    });
  }

  function showLable() {
    const imageLabel = document.getElementById("image-label");
    imageLabel.classList.remove("hidden");
  }

  function hideLable() {
    const imageLabel = document.getElementById("image-label");
    imageLabel.classList.add("hidden");
  }

  return (
    <div className=" flex h-screen max-w-7xl mx-auto font-poppins">
      <div className="bg-white w-1/3 pl-4 py-3 flex flex-col">
        <div className="flex-grow">
          <div className="flex justify-between items-center mr-4 mb-3">
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
            <div className="flex items-center  border-2 border-blue-500 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>

              {userName}
            </div>
          </div>
          {Object.keys(onlinePeopleExcludingSelf).map((userId) => (
            <Users
              key={userId}
              userId={userId}
              online={true}
              selected={selectedUserId}
              onClick={() => selectedUser(userId)}
              userName={onlinePeople[userId]}
            ></Users>
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <Users
              key={userId}
              userId={userId}
              online={false}
              selected={selectedUserId}
              onClick={() => selectedUser(userId)}
              userName={offlinePeople[userId]}
            ></Users>
          ))}
        </div>
        <div className="gap-3 mr-4">
          <button
            onClick={handleLogOut}
            className="bg-blue-600 text-white w-full  rounded-full"
          >
            logout
          </button>
        </div>
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
                        {message?.file && (
                          <img className="p-0" src={message.file} alt="" />
                        )}
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
            className="flex items-center gap-2 relative"
            onSubmit={handleSendMessage}
          >
            <div
              id="image-label"
              className="absolute -top-10 bg-blue-600 p-1 text-white rounded-xl hidden"
            >
              Only Select Image(JPG,JPEG,PNG)
            </div>
            <label
              onMouseMove={showLable}
              onMouseOut={hideLable}
              id="image-input"
              className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer "
            >
              <input type="file" className="hidden" onChange={sendFlie} />
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
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </label>
            <input
              value={newMessage}
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type Your Message Here"
              className="flex-grow border-none p-2 rounded-lg"
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-lg"
              disabled={newMessage.length === 0 || newMessage.file === null}
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
      <div id="image-toast" className="toast hidden">
        <div className="alert alert-info">
          <span>Please Select Image</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
