// import React, { useState, useEffect } from "react";
// import { getAllChatRooms } from "../services/chatService";
// import { socket, connectSocket, disconnectSocket, listenForMessages, stopListeningForMessages } from "../services/socket";

// const ChatRoomList = ({ token }) => {
//   const [chatRooms, setChatRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // ✅ Connect to WebSocket Server
//     connectSocket();

//     // ✅ Fetch initial chat rooms via REST API
//     const fetchChatRooms = async () => {
//       try {
//         const rooms = await getAllChatRooms(token);
//         setChatRooms(rooms);
//       } catch (err) {
//         setError("Failed to load chat rooms");
//         console.error("Error fetching chat rooms:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchChatRooms();

//     // ✅ Listen for new chat rooms via WebSocket
//     listenForMessages((newRoom) => {
//       setChatRooms((prevRooms) => [...prevRooms, newRoom]);
//     });

//     // ✅ Cleanup function to disconnect WebSocket
//     return () => {
//       stopListeningForMessages();
//       disconnectSocket();
//     };
//   }, [token]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Chat Rooms</h1>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading chat rooms...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <ul className="space-y-4">
//             {chatRooms.map((room) => (
//               <li key={room._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
//                 <span className="text-gray-700 font-medium">{room.name}</span>
//                 <button
//                   onClick={() => console.log(`Joining ${room.name}`)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
//                 >
//                   Join
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatRoomList;
import React, { useState, useEffect } from "react";
import { getAllChatRooms } from "../api/chatApi";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const data = await getAllChatRooms();
        setChatRooms(data);
      } catch (err) {
        setError("Failed to load chat rooms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Chat Rooms</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading chat rooms...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="space-y-4">
            {chatRooms.map((room) => (
              <li key={room._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">{room.name}</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                  Join
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
