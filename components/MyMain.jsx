"use client";
import React from "react";
import MyAlert from "./MyAlert";
import { MyContextProvider } from "@/global_state/MyContext";

const MyMain = ({ children }) => {
  return (
    <MyContextProvider>
      <MyAlert />

      {children}
    </MyContextProvider>
  );
};

export default MyMain;
