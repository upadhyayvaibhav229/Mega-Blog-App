import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, PostCard } from '../components';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/all-posts`, {
                    withCredentials: true,
                });

                // console.log("✅ API response", res.data);

                const posts = res.data?.data; // ✅ Correct
                if (posts?.length === 0) {
                    // console.warn("⚠️ No posts found");
                } else {
                    // console.log("✅ Posts fetched:", posts);
                    setPosts(posts);
                }

                // console.log("✅ API response", res.data);
                // console.log("✅ Posts fetched:", posts);

            } catch (err) {
                // console.error('❌ Failed to fetch posts:', err);
            }
        };

        fetchPosts();
    }, []);

    if (posts?.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                {`Login to read posts`}
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'>
                    {posts?.map?.((post) => {
                        return (
                            <div key={post._id} className='p-2 w-full'>
                                <PostCard {...post} />
                            </div>
                        );
                    })}

                </div>
            </Container>
        </div>
    );
}

export default Home;
