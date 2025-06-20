// src/components/Message.js
import React from 'react';
import './Message.css'; // Optional styling file

const Message = ({ variant = 'info', children }) => {
  return <div className={`message ${variant}`}>{children}</div>;
};

export default Message;