// import React, { useEffect, useState } from "react";
// import QuoraBox from "./QuoraBox";
// import "./css/Feed.css";
// import Post from "./Post";
// // import axios from 'axios';
// import api from "../api"


// function Feed() {
//   const [posts, setPosts] = useState([]);

  
//   useEffect(() => {
//     api
//       .get("/api/question")
//       .then((res) => {
//          console.log(res.data);
//         setPosts(res.data.reverse());
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, []);

//   return (
//     <div className="feed">
//       <QuoraBox />
//       {posts.map((post, index) => (
//         <Post key={index} post={post} />
//       ))}
     
//     </div>
//   );
// }

// export default Feed;
import React, { useEffect, useState } from "react";
import QuoraBox from "./QuoraBox";
import Post from "./Post";
import api from "../api";
import { useAuth } from "./AuthContext";

function Feed() {
  const [posts, setPosts] = useState([]);
  //const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  // const fetchQuestions = async () => {
  //   try {
  //     const res = await api.get("/api/questions");
  //     setPosts(res.data.reverse());
  //   } catch (error) {
  //     console.error("Error fetching questions:", error);
  //   }
  // };
  const fetchQuestions = async () => {
    try {
      const res = await api.get("/api/questions");
      console.log("Fetched Questions:", res.data); // Debugging
      setPosts(res.data.reverse());
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  
  return (
    <div className="feed">
      { <QuoraBox />}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
