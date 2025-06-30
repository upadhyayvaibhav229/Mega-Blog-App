import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/all-posts`,
          {
            withCredentials: true,
          }
        );

        setPosts(res.data?.data || []);
        setFilteredPosts(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const tabs = ["All", "Technology", "Startup", "Lifestyle", "Finance"];

  const handleFilter = useCallback(
    (category) => {
      setActiveTab(category);

      if (category === "All") {
        setFilteredPosts(posts); // reset to all
      } else {
        const filtered = posts.filter((post) => post.category === category);
        setFilteredPosts(filtered);
      }
    },
    [posts]
  );

  return (
    <div className="w-full py-8">
      <Container>
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilter(tab)}
              className={`${
                tab === activeTab
                  ? "bg-[#5044E5] text-white"
                  : "bg-white text-[#5044E5]"
              } px-4 py-2 rounded-lg border border-[#5044E5] mr-2 mb-2`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {filteredPosts?.map?.((post) => (
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