import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch chat rooms from the backend
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/rooms/${chatRooms}`); // Adjust the URL if needed
        setChatRooms(response.data);
      } catch (err) {
        setError("Failed to load chat rooms");
        console.error("Error fetching chat rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Chat Rooms
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading chat rooms...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <ul className="space-y-4">
              {chatRooms.map((room) => (
                <li
                  key={room._id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <span className="text-gray-700 font-medium">{room.name}</span>
                  <button
                    onClick={() => console.log(`Joining ${room.name}`)} // You can add the logic to join the room here
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
