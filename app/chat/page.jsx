"use client";
import { useMyContext } from "@/global_state/MyContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
let socket;

import {
  FaEllipsisH,
  FaHamburger,
  FaHome,
  FaPlus,
  FaLock,
  FaLockOpen,
  FaPlane,
  FaPaperPlane,
} from "react-icons/fa";
import { io } from "socket.io-client";

const SubMenu = ({ selectedSection, setSelectedSection }) => {
  return (
    <div className="grid grid-cols-12 gap-2 my-4 ">
      <div
        className={` border col-span-6 p-4 rounded flex justify-center ${
          selectedSection === "home" ? "shadow-md shadow-slate-500" : ""
        } cursor-pointer`}
        onClick={() => setSelectedSection("home")}
      >
        <FaHome className="text-xl" />
      </div>
      <div
        className={` border col-span-6 p-4 rounded flex justify-center ${
          selectedSection === "addContact" ? "shadow-md shadow-slate-500" : ""
        } cursor-pointer`}
        onClick={() => setSelectedSection("addContact")}
      >
        <FaPlus className="text-xl" />
      </div>
    </div>
  );
};
const Contacts = () => {
  const {
    contactList,
    filteredContactList,
    setFilteredContactList,
    setLoginHappen,
    loginHappen,
    handleAlert,
    alreadyInContact,
  } = useMyContext();
  const [id, setId] = useState();
  const handleChange = (e) => {
    const searchQuery = e.target.value;
    const filtered = contactList.filter((contact) => {
      return contact.userName.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredContactList(filtered);
  };
  const addContact = async (idToBeAdded) => {
    try {
      const addToId = JSON.parse(localStorage.getItem("loginData")).id;
      const response = await fetch(
        `/api/Users/add/${idToBeAdded}/to/${addToId}`,
        {
          method: "PATCH",
        }
      );
      const json = await response.json();
      changeLoginHappen();
      handleAlert(response, json.message);
    } catch (error) {
      console.log(error);
    }
  };

  const removeContact = async (idToBeRemoved) => {
    try {
      const response = await fetch(
        `/api/Users/remove/${idToBeRemoved}/from/${id}`,
        {
          method: "PATCH",
        }
      );
      const json = await response.json();
      changeLoginHappen();
      handleAlert(response, json.message);
    } catch (error) {
      console.log(error);
    }
  };
  const changeLoginHappen = () => {
    if (loginHappen) setLoginHappen(false);
    else setLoginHappen(true);
  };
  useEffect(() => {
    setId(JSON.parse(localStorage?.getItem("loginData"))?.id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="formGroup">
        <input
          type="text"
          placeholder="Search User..."
          id="searchUser"
          onChange={handleChange}
        />
      </div>
      <div className="contacts flex flex-col gap-2">
        {(filteredContactList.length > 0 &&
          filteredContactList.map((contact) => {
            return (
              <div
                key={contact._id}
                className="flex items-center justify-between border p-2 rounded "
              >
                {contact.userName}
                {contact.addedBy.some(
                  (item) => String(item._id) === String(id)
                ) ? (
                  <FaPlus
                    className="cursor-pointer rotate-45 transition-all"
                    onClick={() => removeContact(contact._id)}
                  />
                ) : (
                  <FaPlus
                    className="cursor-pointer transition-all"
                    onClick={() => addContact(contact._id)}
                  />
                )}
              </div>
            );
          })) || <div>No Contacts...</div>}
      </div>
    </div>
  );
};

const Chats = () => {
  const {
    addedUsers,
    blockedUsers,
    loginHappen,
    setLoginHappen,
    handleAlert,
    userWithoutPopulating,
    setSelectedChat,
    selectedChat,
  } = useMyContext();
  const [id, setId] = useState();
  const blockUser = async (idToBeBlocked) => {
    const response = await fetch(
      `/api/Users/block/${idToBeBlocked}/from/${id}`,
      {
        method: "PATCH",
      }
    );
    const json = await response.json();
    handleAlert(response, json.message);
    changeLoginHappen();
  };

  const unBlockUser = async (idToBeUnblock) => {
    const response = await fetch(
      `/api/Users/unBlock/${idToBeUnblock}/from/${id}`,
      {
        method: "PATCH",
      }
    );
    const json = await response.json();
    handleAlert(response, json.message);
    changeLoginHappen();
  };
  const changeLoginHappen = () => {
    if (loginHappen) setLoginHappen(false);
    else setLoginHappen(true);
  };
  useEffect(() => {
    setId(JSON.parse(localStorage?.getItem("loginData"))?.id);
  }, []);
  return (
    <div>
      <input type="text" placeholder="Search Chat" />
      <div className="flex flex-col gap-2 my-4 cursor-pointer hover:shadow">
        {addedUsers.length > 0
          ? addedUsers.map((addedUser, index) => {
              return (
                <div
                  className="text-white flex items-center justify-between border p-2 rounded hover:shadow-sm hover:shadow-slate-200 "
                  onClick={() => {
                    if (selectedChat === null) {
                      setSelectedChat({
                        userName: addedUser.userName,
                        _id: addedUser._id,
                      });
                    } else if (selectedChat.userName !== addedUser.userName) {
                      setSelectedChat({
                        userName: addedUser.userName,
                        _id: addedUser._id,
                      });
                    }
                  }}
                  key={addedUser._id}
                >
                  <span>{addedUser.userName}</span>
                  {addedUser.blockedBy.some((item) => String(item) === id) ? (
                    <FaLockOpen
                      className="hover:scale-110 transition-all"
                      onClick={() =>
                        unBlockUser(
                          String(userWithoutPopulating.addedUsers[index])
                        )
                      }
                    />
                  ) : (
                    <FaLock
                      className="hover:scale-110 transition-all"
                      onClick={() =>
                        blockUser(
                          String(userWithoutPopulating.addedUsers[index])
                        )
                      }
                    />
                  )}
                </div>
              );
            })
          : "No Contacts Added Yet"}
      </div>
    </div>
  );
};
const SideBar = ({ className, setExpanded }) => {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState("home");
  const [menu, setMenu] = useState(false);
  const logout = () => {
    setMenu(false);
    localStorage.removeItem("loginData");
    router.push("/");
  };
  const createGroup = () => {
    setMenu(false);
  };
  return (
    <div className={className}>
      <div className="flex justify-between items-center relative">
        <h1 className="text-xl font-semibold">
          {localStorage !== undefined
            ? JSON.parse(localStorage?.getItem("loginData"))?.userName
            : ""}
        </h1>
        <FaEllipsisH
          className="rotate-90 cursor-pointer"
          onClick={() => {
            !menu ? setMenu(true) : setMenu(false);
          }}
        />
        <div
          className={`absolute bg-white text-black right-4 py-2 rounded  top-8 ${
            menu ? "flex" : "hidden"
          } flex-col gap-2 shadow`}
        >
          <span
            className="cursor-pointer hover:bg-slate-200 p-2"
            onClick={createGroup}
          >
            Create A Group
          </span>
          <span
            onClick={logout}
            className="cursor-pointer hover:bg-slate-200 p-2"
          >
            Logout
          </span>
        </div>
      </div>
      <SubMenu
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />
      {selectedSection === "home" ? <Chats /> : <Contacts />}
    </div>
  );
};
const ChatBox = ({ className, setExpanded }) => {
  const [message, setMessage] = useState("");
  const {
    selectedChat,
    chats,
    getChats,
    setSelectedChat,
    addedUsers,
    blockedUsers,
    userWithoutPopulating,
    handleAlert,
  } = useMyContext();
  console.log(userWithoutPopulating);
  const [gettedChats, setGettedChats] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]);
  useEffect(() => {
    let chatBox = document.getElementById("chatBox");

    socket = io();
    socket.on("connect", () => {
      console.log("connected");
      socket.emit(
        "getChatsRequest",
        JSON.parse(localStorage.getItem("loginData")).id
      );
      socket.on("getChats", (chats) => {
        setGettedChats(chats);
      });
      socket.on("showChats", () => {
        console.log("show chats");
      });
      socket.emit(
        "userName",
        JSON.parse(localStorage.getItem("loginData")).userName
      );
      chatBox.scrollTop = chatBox.scrollHeight;

      // JSON.parse("loginData").userName;
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    console.log(addedUsers);
    addedUsers.map((addedUser) => {
      return socket.emit("createRoom", {
        to: addedUser._id,
        from: JSON.parse(localStorage.getItem("loginData")).id,
      });
    });
  }, [addedUsers]);
  useEffect(() => {
    let chatBox = document.getElementById("chatBox");
    console.log(selectedChat);
    if (selectedChat !== null) {
      chatBox.scrollTop = chatBox.scrollHeight;

      socket.emit(
        "getChatsRequest",
        JSON.parse(localStorage.getItem("loginData")).id,
        () => {}
      );
      setDisplayMessages((prev) => []);
      gettedChats.map((chats) => {
        if (
          (chats.chatBetween.user1 ===
            JSON.parse(localStorage.getItem("loginData")).id &&
            chats.chatBetween.user2 === selectedChat._id) ||
          (chats.chatBetween.user1 === selectedChat._id &&
            chats.chatBetween.user2 ===
              JSON.parse(localStorage.getItem("loginData")).id)
        ) {
          chats.messages.map((message) => {
            if (
              message.senderId ===
              JSON.parse(localStorage.getItem("loginData")).id
            ) {
              setDisplayMessages((prev) => [
                ...prev,
                <div key={message.timeStamp} className="myMessageParent">
                  <div className="myMessage">
                    <span className="text-xs"> You:</span>{" "}
                    <span>{message.message}</span>
                  </div>
                </div>,
              ]);
              chatBox.scrollTop = chatBox.scrollHeight;
            } else {
              setDisplayMessages((prev) => [
                ...prev,
                <div key={message.timeStamp} className="othersMessageParent ">
                  <div className="othersMessage">
                    {" "}
                    <span className="text-xs"> {message.senderName}:</span>{" "}
                    <span> {message.message}</span>
                  </div>
                </div>,
              ]);
              chatBox.scrollTop = chatBox.scrollHeight;
            }
          });
        }
      });
    }
    chatBox.scrollTop = chatBox.scrollHeight;
    const handleSocketMessage = (data) => {
      console.log(data.senderName);
      console.log(selectedChat?.userName);
      let myName = JSON.parse(localStorage.getItem("loginData")).userName;
      // console.log(selectedChat);
      if (selectedChat === null) {
        return;
      } else if (
        selectedChat.userName === data.senderName ||
        myName === data.senderName
      ) {
        console.log("Hello World");
        if (data.senderId === socket.id) {
          // Use concat for immutability

          setDisplayMessages((prevMessages) => [
            ...prevMessages,
            <div key={data.messageId} className="myMessageParent">
              <div className="myMessage">
                <span className="text-xs"> You:</span>{" "}
                <span>{data.message}</span>
              </div>
            </div>,
          ]);
        } else {
          setDisplayMessages((prevMessages) => [
            ...prevMessages,
            <div key={data.messageId} className="othersMessageParent ">
              <div className="othersMessage">
                {" "}
                <span className="text-xs"> {data.senderName}:</span>{" "}
                <span> {data.message}</span>
              </div>
            </div>,
          ]);
        }
      }

      chatBox.scrollTop = chatBox.scrollHeight;
    };
    socket.on("messageFromServer", handleSocketMessage);
    return () => {
      socket.off("messageFromServer", handleSocketMessage);
    };
  }, [selectedChat]);
  const sendMessage = (e) => {
    if (message !== "" && selectedChat !== null) {
      let selectedChatBlocked = userWithoutPopulating.blockedUsers.some(
        (userId) => userId === selectedChat._id
      );
      console.log(selectedChatBlocked);
      let blockedBySelectedChat = userWithoutPopulating.blockedBy.some(
        (userId) => userId === selectedChat._id
      );
      const checkBlocked = () => {
        if (blockedBySelectedChat || selectedChatBlocked) {
          if (blockedBySelectedChat) {
            const response = {
              ok: false,
            };
            handleAlert(response, "You are blocked by this user...");
          } else if (selectedChatBlocked) {
            const response = {
              ok: false,
            };
            handleAlert(response, "Unblock this user first...");
          }
          return true;
        } else return false;
      };
      console.log(blockedBySelectedChat);

      if (e.type === "keyup") {
        if (e.key === "Enter") {
          let blocked = checkBlocked();
          if (!blocked) {
            socket.emit("message", {
              message,
              to: selectedChat._id,
              from: JSON.parse(localStorage.getItem("loginData")).id,
              senderName: JSON.parse(localStorage.getItem("loginData"))
                .userName,
            });
          }

          setMessage("");
        } else return;
      } else {
        let blocked = checkBlocked();
        if (!blocked) {
          socket.emit("message", {
            message,
            to: selectedChat._id,
            from: JSON.parse(localStorage.getItem("loginData")).id,
            senderName: JSON.parse(localStorage.getItem("loginData")).userName,
          });
          setMessage("");
        }
      }
    }
  };

  const onMessageType = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className={className}>
      <div className="border py-2 px-4 right-0 bg-slate-800 fixed top-0 text-white rounded">
        {selectedChat !== null ? selectedChat.userName : null}
      </div>
      <div className="chatBox px-2 py-6" id="chatBox">
        {displayMessages.map((displayMessage) => displayMessage)}
      </div>
      <div className="messageBox bottom-2 flex gap-2  ">
        <input
          type="text"
          name="message"
          id="message"
          placeholder="Message..."
          className=" "
          onChange={onMessageType}
          value={message}
          onKeyUp={sendMessage}
        />
        <button
          onClick={sendMessage}
          type="button"
          className="px-4 py-1 rounded bg-green-400 flex items-center gap-2 hover:bg-green-500 transition-all "
        >
          <FaPaperPlane /> Send
        </button>
      </div>
    </div>
  );
};
const Chat = () => {
  const [expanded, setExpanded] = useState(false);

  const [loginData, setLoginData] = useState();
  useEffect(() => {
    setLoginData(localStorage.getItem("loginData"));
  }, []);
  return (
    (loginData && (
      <div className="grid  sm:grid-cols-12 ">
        {!expanded ? (
          <FaHamburger
            className="fixed top-6 right-1/2 sm:hidden block z-50"
            onClick={() => setExpanded(true)}
          />
        ) : (
          <span
            className="fixed top-6 right-1/2 text-white sm:hidden block font-black  z-20"
            onClick={() => setExpanded(false)}
          >
            <FaPlus className="rotate-45" />
          </span>
        )}
        <SideBar
          className={`sm:col-span-4 p-4 bg-gradient-to-tl from-gray-600  to-gray-800 min-h-screen sticky text-white  sm:block ${
            expanded ? "block" : "hidden"
          } `}
          setExpanded={setExpanded}
        />
        <ChatBox
          className={` sm:col-span-8 sm:block ${
            expanded ? "hidden" : "block"
          } p-4 bg-gradient-to-l from-pink-50 to-pink-100 h-screen relative `}
          setExpanded={setExpanded}
        />
      </div>
    )) || (
      <div>
        <h1 className="text-center  text-3xl">Please Login First!</h1>
      </div>
    )
  );
};

export default Chat;
