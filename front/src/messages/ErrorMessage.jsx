import React, { useState } from "react";

const ErrorMessage = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      style={{
        color: "red",
        margin: "10px 0",
        padding: "10px",
        border: "1px solid red",
        borderRadius: "5px",
        backgroundColor: "#ffe6e6",
      }}
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        style={{
          marginLeft: "10px",
          backgroundColor: "transparent",
          border: "none",
          color: "red",
          cursor: "pointer",
        }}
      >
        X
      </button>
    </div>
  );
};

export default ErrorMessage;
