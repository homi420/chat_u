import { useMyContext } from "@/global_state/MyContext";
import React from "react";

const MyAlert = () => {
  const { alert } = useMyContext();
  return (
    <div
      className={` ${alert.show === true ? "block" : "hidden"} ${
        alert.type === "success" ? "bg-green-500" : "bg-red-500"
      } p-4 rounded fixed top-1/2 left-1/2 z-30`}
    >
      <p className="text-white">{alert.message}</p>
    </div>
  );
};

export default MyAlert;
