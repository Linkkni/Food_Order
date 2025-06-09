import React from "react";

const Message = ({ text, type = "error" }) => {
  const baseClasses = "p-4 rounded-lg my-4 text-center";
  const typeClasses = {
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    info: "bg-blue-100 text-blue-800",
  };
  return <div className={`${baseClasses} ${typeClasses[type]}`}>{text}</div>;
};

export default Message;
