import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData
    ? (post.userId === userData._id ||
       post.userId?._id === userData._id)
    : false;

    console.log(isAuthor);
    


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${slug}`);
                console.log("🔍 Slug from useParams:", slug);

                console.log("full api res", res);


                const result = await res.json();

                if (result.success) {
                    setPost(result.data);
                    console.log("🔎 Post content raw:", result.data.content);

                } else {
                    navigate("/");
                }
                console.log("result.data", result.data);

            } catch (err) {
                console.error("Error fetching post:", err);
                navigate("/");
            }
        };

        console.log(slug);


        if (slug) {
            fetchPost();
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/delete-post/${post.slug}`, {
                method: "DELETE",
                credentials: "include"
            });



            const result = await res.json();
            if (result.success) {
                navigate("/");
            } else {
                alert(result.message || "Failed to delete post");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Delete failed");
        }
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>

                <div className="browser-css">
                    {post.content ? parse(post.content) : "No content available"}
                    
                </div>
            </Container>
        </div>
    ) : null;
}
