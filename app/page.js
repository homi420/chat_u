"use client";
import Home from "@/components/Home";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
export default function Main({ children }) {
  return <Home />;
}
