import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function EditPost() {
  const [post, setPosts] = useState(null);
  const { slug } = useParams();
  const backendUrl = useSelector((state) => state.auth.backendUrl);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      axios
        .get(`${backendUrl}/api/posts/${slug}`)
        .then((res) => {
          if (res.data?.success) {
            setPosts(res.data.data); // ✅ post fetched
          } else {
            toast.error("Post not found");
            navigate("/");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response?.data?.message || "Failed to fetch post");
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [slug, navigate, backendUrl]);

  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
