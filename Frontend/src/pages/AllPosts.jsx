import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, PostCard } from '../components';

function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/all-posts`, {
                    withCredentials: true,
                });
                setPosts(res.data.data); // adjust if your backend returns { posts: [...] }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post._id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
