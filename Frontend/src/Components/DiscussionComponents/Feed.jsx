
import React, { useEffect, useState } from "react";
import QuoraBox from "./QuoraBox";
import Post from "./Post";
import api from "../../api";
import { useAuth } from "../AuthComponents/AuthContext";

function Feed() {
  const [posts, setPosts] = useState([]);
  //const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

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
