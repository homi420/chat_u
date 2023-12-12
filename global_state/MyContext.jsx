"use client";
import { createContext, useContext, useState, useEffect } from "react";
const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [contactList, setContactList] = useState([]);
  const [filteredContactList, setFilteredContactList] = useState([]);
  const [loginHappen, setLoginHappen] = useState(false);
  const [alreadyInContact, setAlreadyInContact] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [userWithoutPopulating, setUserWithoutPopulating] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [chats, setChats] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("loginData")) {
      var id = JSON.parse(localStorage.getItem("loginData")).id;
    } else {
      id = undefined;
    }
    const getContacts = async () => {
      const response = await fetch(`/api/Users/${id}`, {
        method: "GET",
      });
      const json = await response.json();
      const filteringAlready = json.filter((contact) => {
        return contact.addedUsers.some((item) => {
          return item._id === id;
        });
      });
      setAlreadyInContact(filteringAlready);
      setContactList(json);
      setFilteredContactList(json);
    };
    const getAddedUsers = async () => {
      const response = await fetch(`/api/Users/addedUsers/of/${id}`);
      const json = await response.json();
      if (response.ok) {
        setAddedUsers(json.addedUsers);
        setBlockedUsers(json.blockedUsers);
        setUserWithoutPopulating(json.userWithoutPopulating);
      } else {
        handleAlert(response, json.message);
      }
    };
    if (id) getContacts();
    if (id) getAddedUsers();
  }, [loginHappen]);
  const handleAlert = (response, message) => {
    if (response.ok) {
      setAlert({ show: true, type: "success", message });
      setTimeout(() => {
        setAlert({
          show: false,
          type: "",
          message: "",
        });
      }, 2000);
    } else {
      setAlert({ show: true, type: "fail", message });
      setTimeout(() => {
        setAlert({
          show: false,
          type: "",
          message: "",
        });
      }, 2000);
    }
  };
  const getChats = async () => {
    const response = await fetch(
      `/api/Chats/${JSON.parse(localStorage.getItem("loginData")).id}`
    );
    const json = await response.json();
    console.log(json);
    setChats(json);
  };
  return (
    <MyContext.Provider
      value={{
        handleAlert,
        alert,
        contactList,
        setContactList,
        filteredContactList,
        setFilteredContactList,
        setLoginHappen,
        loginHappen,
        alreadyInContact,
        addedUsers,
        blockedUsers,
        userWithoutPopulating,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        getChats,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
export const useMyContext = () => useContext(MyContext);
