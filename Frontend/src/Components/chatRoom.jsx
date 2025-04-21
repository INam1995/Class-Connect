import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaEye, FaSmile, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { folderId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [seenByMap, setSeenByMap] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get(`http://localhost:5000/api/chat/messages/${folderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages", err));

    socket.on("message", (message) => {
      if (message.folderId === folderId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.emit("join_room", { roomId: folderId, userId: "User123" });

    axios.put(`http://localhost:5000/api/chat/messages/seen/${folderId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => console.error("Error marking messages as seen", err));

    socket.on("messages_seen", ({ folderId: seenFolderId, messages: updatedMessages }) => {
      if (seenFolderId === folderId) {
        setMessages(updatedMessages);
      }
    });

    return () => socket.off("message");
  }, [folderId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;

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

      setMessages((prev) => [
        ...prev,
        { ...res.data, sender: res.data.sender || { name: "You" } },
      ]);
      socket.emit("send_message", { chatRoom: folderId, sender: "You", text: newMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const toggleSeenBy = (messageId) => {
    setSeenByMap((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const startEditing = (message) => {
    setEditingMessage({ ...message });
  };

  const saveEdit = async () => {
    if (!editingMessage) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:5000/api/chat/messages/${editingMessage._id}`,
        { text: editingMessage.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((msg) => (msg._id === editingMessage._id ? editingMessage : msg))
      );
      setEditingMessage(null);
    } catch (err) {
      console.error("Error editing message", err);
    }
  };

  const deleteMessage = async (messageId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/chat/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error("Error deleting message", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-2/12 h-full bg-gray-900 text-white p-4">
        <h2 className="text-lg font-semibold mb-4">Group Chat</h2>
        <ul className="space-y-1 text-sm">
          <li>NIKI</li>
          <li>Samantha</li>
          <li>Kai</li>
          <li>Cheena</li>
          <li>Gori</li>
          <li>SRK</li>
          <li>Abhi</li>
        </ul>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="p-2 rounded-lg bg-gray-200 text-black">
              <strong>{msg.sender?.name || "Unknown User"}:</strong>
              {editingMessage?.id === msg._id ? (
                <input
                  type="text"
                  value={editingMessage.text}
                  onChange={(e) => setEditingMessage({ ...editingMessage, text: e.target.value })}
                  className="w-full p-1 border rounded mt-1"
                />
              ) : (
                <div>{msg.text}</div>
              )}

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
                  {msg.seenBy?.length > 0 ? (
                    msg.seenBy.map((user) => <div key={user._id}>{user.name}</div>)
                  ) : (
                    <p>No one has seen this yet</p>
                  )}
                </div>
              )}

              <div className="flex space-x-2 mt-2">
                {editingMessage?.id === msg._id ? (
                  <button onClick={saveEdit} className="text-green-500 text-xs">Save</button>
                ) : (
                  <button onClick={() => startEditing(msg)} className="text-yellow-500 text-xs flex items-center">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                )}
                <button onClick={() => deleteMessage(msg._id)} className="text-red-500 text-xs flex items-center">
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t flex items-center relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="mr-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <FaSmile size={24} />
          </button>

          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-14 left-4 z-10 bg-white shadow-xl p-3 rounded-lg border border-gray-200">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 p-2 border rounded-lg"
          />

          <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
