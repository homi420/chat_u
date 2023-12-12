"use client";
import { useMyContext } from "@/global_state/MyContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignUp = ({ handleOnSubmit, formData, handleOnChange, changeType }) => {
  return (
    <div className="register">
      <h3 className="text-3xl my-10 underline-offset-8 underline">Register.</h3>
      <form className="myForm" onSubmit={(e) => handleOnSubmit(e, "SignUp")}>
        <div className="formGroup">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={formData.userName}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <button type="submit" className="btn1 self-start">
            Sign Up
          </button>
          <span className="">
            Already a user?{" "}
            <button
              type="button"
              onClick={changeType}
              className="underline underline-offset-4"
            >
              Login
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

const Login = ({ handleOnSubmit, formData, handleOnChange, changeType }) => {
  return (
    <div className="register">
      <h3 className="text-3xl my-10 underline-offset-8 underline">Login.</h3>

      <form className="myForm" onSubmit={(e) => handleOnSubmit(e, "Login")}>
        <div className="formGroup">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={formData.userName}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <button type="submit" className="btn1 self-start">
            Login
          </button>
          <span className="">
            No Account?{" "}
            <button
              type="button"
              onClick={changeType}
              className="underline underline-offset-4"
            >
              Sign Up
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

const Home = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [type, setType] = useState("signUp");
  const { handleAlert, setLoginHappen, loginHappen } = useMyContext();
  const handleOnSubmit = async (e, formType) => {
    e.preventDefault();
    if (formType === "SignUp") {
      const response = await fetch("/api/auth/SignUp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });
      const json = await response.json();
      setFormData({
        userName: "",
        password: "",
      });
      handleAlert(response, json.message);
      if (response.ok) changeType();
    } else {
      const response = await fetch("/api/auth/Login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });
      const json = await response.json();
      handleAlert(response, json.message);
      if (response.ok) {
        localStorage.setItem(
          "loginData",
          JSON.stringify({
            loggedIn: true,
            userName: json.user.userName,
            id: json.user._id,
          })
        );
        setFormData({
          userName: "",
          password: "",
        });
        if (!loginHappen) setLoginHappen(true);
        else setLoginHappen(false);
        router.push("/chat");
      }
    }
  };
  const changeType = () => {
    if (type === "signUp") setType("login");
    else setType("signUp");
  };
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="flex justify-center p-4 items-center min-h-screen bg-gradient-to-r from-blue-100  to-gray-800 h-20 w-full">
      {type === "signUp" ? (
        <SignUp
          handleOnSubmit={handleOnSubmit}
          formData={formData}
          handleOnChange={handleOnChange}
          changeType={changeType}
        />
      ) : (
        <Login
          handleOnSubmit={handleOnSubmit}
          formData={formData}
          handleOnChange={handleOnChange}
          changeType={changeType}
        />
      )}
    </div>
  );
};

export default Home;
