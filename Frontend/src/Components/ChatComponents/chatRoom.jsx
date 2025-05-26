// imports (same as before)
import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane, FaEye, FaSmile, FaEdit, FaTrash, FaEllipsisV
} from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { folderId } = useParams();
  const [items, setItems] = useState([]); // holds both messages and polls
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showPollForm, setShowPollForm] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [folderUsers, setFolderUsers] = useState([]);

  const emojiPickerRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [msgRes, pollRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/chat/messages/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/chat/polls/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const messages = msgRes.data.map((m) => ({ ...m, type: "message" }));
      const polls = pollRes.data.map((p) => ({ ...p, type: "poll" }));
      const combined = [...messages, ...polls].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setItems(combined);
    } catch (err) {
      console.error("Error fetching chat data:", err);
    }
  };

  const fetchFolderUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/folders/${folderId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolderUsers(res.data);
    } catch (err) {
      console.error("Error fetching folder users:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchFolderUsers();

    socket.emit("join_room", { roomId: folderId, userId: "User123" });

    socket.on("message", (message) => {
      if (message.folderId === folderId) {
        setItems((prev) =>
          [...prev, { ...message, type: "message" }].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
      }
    });

    socket.on("message_edited", (updatedMessage) => {
      setItems((prev) =>
        prev.map((item) =>
          item.type === "message" && item._id === updatedMessage._id
            ? { ...item, text: updatedMessage.text }
            : item
        )
      );
    });

    return () => {
      socket.off("message");
      socket.off("message_edited");
    };
  }, [folderId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      const newMsg = { ...res.data, type: "message" };
      setItems((prev) => [...prev, newMsg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      socket.emit("send_message", { chatRoom: folderId, sender: "You", text: newMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const createPoll = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`http://localhost:5000/api/chat/polls/${folderId}`, newPoll, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newPollData = { ...res.data, type: "poll" };
      setItems((prev) => [...prev, newPollData].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      setNewPoll({ question: "", options: ["", ""] });
      setShowPollForm(false);
    } catch (err) {
      console.error("Error creating poll:", err);
    }
  };

  const votePoll = async (pollId, optionIndex) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/chat/polls/vote/${pollId}`,
        { optionIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAll();
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const deletePoll = async (pollId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/chat/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch (err) {
      console.error("Error deleting poll:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F2FF] font-sans">
      {/* Sidebar */}
      <div className="w-2/12 bg-[#FEFBF0] p-6 shadow-md rounded-tr-3xl rounded-br-3xl">
        <h2 className="text-xl font-bold text-[#FF6B00] mb-6">Group Chat</h2>
        <ul className="space-y-2 text-sm">
          {folderUsers.length > 0 ? folderUsers.map((user) => (
            <li key={user._id} className="bg-[#EEE5FF] px-3 py-2 rounded-full font-medium hover:bg-[#D6CCFF]">
              {user.name}
            </li>
          )) : <li className="text-gray-500">No users joined yet.</li>}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col px-6 py-4 relative bg-[#F8F3E7]">
        <div className="absolute right-6 top-6 z-50" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 rounded hover:bg-gray-200">
            <FaEllipsisV />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
              <button onClick={() => { setShowPollForm(true); setShowDropdown(false); }} className="block w-full px-4 py-2 hover:bg-gray-100 text-left">Create Poll</button>
            </div>
          )}
        </div>

        {/* Poll Form */}
        {showPollForm && (
          <div className="bg-white p-4 rounded-xl shadow mb-4">
            <input className="w-full p-2 border mb-2 rounded" placeholder="Poll question"
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
            />
            {newPoll.options.map((opt, idx) => (
              <input key={idx} className="w-full p-2 border mb-2 rounded"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const options = [...newPoll.options];
                  options[idx] = e.target.value;
                  setNewPoll({ ...newPoll, options });
                }}
              />
            ))}
            <button onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })} className="text-sm text-blue-500">+ Add Option</button>
            <div className="mt-2 flex gap-2">
              <button onClick={createPoll} className="bg-[#6C63FF] text-white px-4 py-2 rounded">Create</button>
              <button onClick={() => setShowPollForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        )}

        {/* Combined Messages & Polls */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {items.map((item) => (
            item.type === "message" ? (
              <div key={item._id} className="flex items-center justify-between px-2 py-2 rounded-xl bg-white shadow">
                <div className="font-bold text-[#063D30] mr-4">{item.sender?.name || "Unknown"}</div>
                <div className="flex-1 mx-4">
                  {editingMessage?._id === item._id ? (
                    <input
                      type="text"
                      value={editingMessage.text}
                      onChange={(e) => setEditingMessage({ ...editingMessage, text: e.target.value })}
                      className="w-full p-1 border border-[#DDD] rounded-lg"
                    />
                  ) : (
                    <div>{item.text}</div>
                  )}
                </div>
                <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <div className="flex items-center space-x-2 ml-4">
                  {editingMessage?._id === item._id ? (
                    <button onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token) return;
                      const res = await axios.put(
                        `http://localhost:5000/api/chat/messages/${item._id}`,
                        { text: editingMessage.text },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setItems((prev) =>
                        prev.map((m) => (m._id === item._id ? { ...m, text: res.data.text } : m))
                      );
                      setEditingMessage(null);
                      socket.emit("edit_message", { folderId, message: res.data });
                    }} className="text-green-500 text-xs">Save</button>
                  ) : (
                    <button onClick={() => setEditingMessage({ ...item })} className="text-yellow-500 text-xs flex items-center">
                      <FaEdit className="mr-1" />
                    </button>
                  )}
                  <button onClick={() => {
                    if (window.confirm("Delete message?")) {
                      const token = localStorage.getItem("token");
                      axios.delete(`http://localhost:5000/api/chat/messages/${item._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setItems((prev) => prev.filter((i) => i._id !== item._id));
                    }
                  }} className="text-red-500 text-xs flex items-center">
                    <FaTrash className="mr-1" />
                  </button>
                </div>
              </div>
            ) : (
              <div key={item._id} className="p-4 bg-white rounded shadow">
                <div className="font-bold mb-2">{item.question}</div>
                {item.options.map((opt, idx) => {
                  const totalVotes = item.options.reduce((sum, o) => sum + o.votes.length, 0);
                  const percentage = totalVotes ? (opt.votes.length / totalVotes) * 100 : 0;
                  return (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span>{opt.text}</span>
                        <span>{opt.votes.length} votes</span>
                      </div>
                      <div className="w-full h-4 bg-[#EEE5FF] rounded-full" onClick={() => votePoll(item._id, idx)}>
                        <div className="h-full bg-[#6C63FF]" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => deletePoll(item._id)} className="text-red-500 mt-2 text-sm">Delete Poll</button>
              </div>
            )
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t mt-4 flex items-center relative rounded-2xl shadow-md">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="mr-3 p-2 bg-[#EEE5FF] hover:bg-[#D6CCFF] rounded-full"
          >
            <FaSmile size={22} className="text-[#6C63FF]" />
          </button>
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-16 left-4 z-10 bg-white shadow-xl p-3 rounded-lg border border-gray-200">
              <EmojiPicker onEmojiClick={(e) => setNewMessage((prev) => prev + e.emoji)} />
            </div>
          )}
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            className="flex-1 p-3 border rounded-xl mr-3 focus:outline-none bg-[#FFD800]"
          />
          <button onClick={sendMessage} className="p-2 bg-[#FF6B00] rounded-full text-white hover:bg-[#e55b00]">
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
