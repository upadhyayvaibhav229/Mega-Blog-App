import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/all-posts`,
          {
            withCredentials: true,
          }
        );
        // console.log("fetched posts", res.data);
        
        setPosts(res.data?.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);



  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {posts?.map?.((post) => (
            <div key={post._id} className="p-2 w-full">
              <PostCard {...post} />
            </div>
          ))}
        </div> 
      </Container>
    </div>
  );
}

export default AllPosts;
