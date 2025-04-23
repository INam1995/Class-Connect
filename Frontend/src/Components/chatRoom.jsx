import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaEye, FaSmile, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
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
  const [polls, setPolls] = useState([]);
  const [showPollForm, setShowPollForm] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
  const [showDropdown, setShowDropdown] = useState(false);

  const emojiPickerRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchPolls = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/chat/polls/${folderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls(res.data);
    } catch (err) {
      console.error("Error fetching polls:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/messages/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    fetchPolls();

    socket.emit("join_room", { roomId: folderId, userId: "User123" });

    socket.on("message", (message) => {
      if (message.folderId === folderId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("message_edited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });

    socket.on("messages_seen", ({ folderId: seenFolderId, messages: updatedMessages }) => {
      if (seenFolderId === folderId) {
        setMessages(updatedMessages);
      }
    });

    axios
      .put(`http://localhost:5000/api/chat/messages/seen/${folderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => console.error("Error marking messages as seen", err));

    return () => {
      socket.off("message");
      socket.off("message_edited");
      socket.off("messages_seen");
    };
  }, [folderId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)
      ) {
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

      const savedMessage = {
        ...res.data,
        sender: res.data.sender || { _id: "You", name: "You" }
      };

      setMessages((prev) => [...prev, savedMessage]);
      socket.emit("send_message", { chatRoom: folderId, sender: "You", text: newMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
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
      const res = await axios.put(
        `http://localhost:5000/api/chat/messages/${editingMessage._id}`,
        { text: editingMessage.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === editingMessage._id ? { ...msg, text: res.data.text } : msg
        )
      );

      socket.emit("edit_message", { folderId, message: res.data });
      setEditingMessage(null);
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/chat/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const createPoll = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(`http://localhost:5000/api/chat/polls/${folderId}`, newPoll, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewPoll({ question: "", options: ["", ""] });
      setShowPollForm(false);
      fetchPolls();
    } catch (err) {
      console.error("Error creating poll:", err);
    }
  };

  const votePoll = async (pollId, optionIndex) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:5000/api/chat/polls/vote/${pollId}`, {
        optionIndex,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolls();
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const deletePoll = async (pollId) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/chat/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolls();
    } catch (err) {
      console.error("Error deleting poll:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F2FF] font-sans">
      <div className="w-2/12 h-full bg-white p-6 shadow-md rounded-tr-3xl rounded-br-3xl">
        <h2 className="text-xl font-bold text-[#FF6B00] mb-6">Group Chat</h2>
        <ul className="space-y-2 text-sm">
          {['NIKI', 'Samantha', 'Kai', 'Cheena', 'Gori', 'SRK', 'Abhi'].map(name => (
            <li key={name} className="bg-[#EEE5FF] text-[#2C2C2C] px-3 py-2 rounded-full font-medium hover:bg-[#D6CCFF] cursor-pointer">{name}</li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col px-6 py-4 relative">
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

        {showPollForm && (
          <div className="bg-white p-4 rounded-xl shadow mb-4">
            <input
              className="w-full p-2 border mb-2 rounded"
              placeholder="Poll question"
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
            />
            {newPoll.options.map((opt, idx) => (
              <input
                key={idx}
                className="w-full p-2 border mb-2 rounded"
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

        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg._id || msg.createdAt} className="p-4 rounded-2xl bg-white shadow text-[#2C2C2C]">
              <strong className="text-[#6C63FF]">{msg.sender?.name || "Unknown User"}:</strong>
              {editingMessage?._id === msg._id ? (
                <input
                  type="text"
                  value={editingMessage.text}
                  onChange={(e) => setEditingMessage({ ...editingMessage, text: e.target.value })}
                  className="w-full mt-2 p-2 border border-[#DDD] rounded-lg"
                />
              ) : (
                <div className="mt-1 text-base">{msg.text}</div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <button onClick={() => toggleSeenBy(msg._id)} className="mt-2 text-sm text-[#6C63FF] flex items-center">
                <FaEye className="mr-1" />
                {msg.seenBy?.length > 0 ? `Seen by ${msg.seenBy.length}` : "Not Seen"}
              </button>
              {seenByMap[msg._id] && (
                <div className="mt-2 text-xs bg-[#FAF9FF] p-2 rounded-lg border border-gray-100">
                  {msg.seenBy?.length > 0
                    ? msg.seenBy.map((user) => <div key={user._id}>{user.name}</div>)
                    : <p>No one has seen this yet</p>}
                </div>
              )}
              <div className="flex space-x-3 mt-2">
                {editingMessage?._id === msg._id ? (
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

          {/* Polls */}
          {polls.map((poll) => (
            <div key={poll._id} className="p-4 bg-white rounded shadow">
              <div className="font-bold mb-2">{poll.question}</div>
              {poll.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => votePoll(poll._id, idx)}
                  className="block w-full text-left bg-[#EEE5FF] hover:bg-[#D6CCFF] px-3 py-2 my-1 rounded"
                >
                  {opt.text} — {opt.votes.length} votes
                </button>
              ))}
              <button onClick={() => deletePoll(poll._id)} className="text-red-500 mt-2 text-sm">Delete Poll</button>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 bg-white border-t mt-4 flex items-center relative rounded-2xl shadow-md">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="mr-3 p-2 bg-[#EEE5FF] hover:bg-[#D6CCFF] rounded-full"
          >
            <FaSmile size={22} className="text-[#6C63FF]" />
          </button>
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-16 left-4 z-10 bg-white shadow-xl p-3 rounded-lg border border-gray-200">
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
            className="flex-1 p-3 border border-gray-300 rounded-xl mr-3 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-[#FF6B00] rounded-full text-white hover:bg-[#e55b00]"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
