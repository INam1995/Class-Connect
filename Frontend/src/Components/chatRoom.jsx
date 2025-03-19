import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaEye, FaSmile } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:5000"); // Ensure backend is running

const ChatRoom = () => {
  const { folderId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [seenByMap, setSeenByMap] = useState({}); // To store seenBy details
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Toggle emoji picker

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    axios
      .get(`http://localhost:5000/api/chat/messages/${folderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages", err));

    socket.on("message", (message) => {
      if (message.folderId === folderId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.emit("join_room", { roomId: folderId, userId: "User123" });

    axios
      .put(`http://localhost:5000/api/chat/messages/seen/${folderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => console.error("Error marking messages as seen", err));

    socket.on("messages_seen", ({ folderId: seenFolderId, messages: updatedMessages }) => {
      if (seenFolderId === folderId) {
        setMessages(updatedMessages);
      }
    });

    return () => {
      socket.off("messages_seen");
    };
  }, [folderId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const message = {
      sender: { _id: "You", name: "You" },
      text: newMessage,
      folderId,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        `http://localhost:5000/api/chat/messages/${folderId}`,
        message,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...res.data, sender: res.data.sender || { name: "You" } },
      ]);

      socket.emit("send_message", { chatRoom: folderId, sender: "You", text: newMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const toggleSeenBy = (messageId) => {
    setSeenByMap((prev) => ({
      ...prev,
      [messageId]: !prev[messageId], // Toggle visibility
    }));
  };

  const handleEmojiClick = (emojiObject) => {
    console.log("Selected Emoji:", emojiObject.emoji);
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender?._id === "You" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
              }`}
            >
              <div>
                <strong>{msg.sender?.name || "Unknown User"}:</strong>
              </div>
              <div>{msg.text}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <button
                onClick={() => toggleSeenBy(msg._id)}
                className="mt-2 text-xs text-blue-500 flex items-center"
              >
                <FaEye className="mr-1" />
                {msg.seenBy?.length > 0 ? `Seen by ${msg.seenBy.length}` : "Not Seen"}
              </button>
              {seenByMap[msg._id] && (
                <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                  {msg.seenBy.length > 0 ? (
                    msg.seenBy.map((user) => <div key={user._id}>{user.name}</div>)
                  ) : (
                    <p>No one has seen this yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Box with Emoji Support */}
        <div className="p-4 bg-white border-t flex items-center relative">
          {/* Stylish Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="mr-2 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-110"
          >
            <FaSmile size={24} />
          </button>

          {/* Emoji Picker (Shown when toggled) */}
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-4 z-10 bg-white shadow-xl p-3 rounded-lg border border-gray-200">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
