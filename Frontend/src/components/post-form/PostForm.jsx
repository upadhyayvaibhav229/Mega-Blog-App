import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);
      formData.append("status", data.status);

      // ✅ Safe file append
      if (data.featuredImage && data.featuredImage.length > 0) {
        formData.append("featuredImage", data.featuredImage[0]);
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/create-post`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await res.json();
      console.log("raw res", result);

      if (!res.ok) {
        throw new Error(result.message || "Failed to create post");
      }

      console.log("Post created:", result);
      navigate(`/post/${result.data.slug}`);
    } catch (err) {
      console.error("Post creation failed:", err.message);
      alert("Failed to create post. " + err.message);
    }
  };

  const slugTransform = useCallback((value) => {
    return value
      ?.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // remove special characters
      .replace(/\s+/g, "-"); // replace spaces with hyphens
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          readOnly // 👈 optional
        />

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("featuredImage", { required: !post })}
        />

        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["draft", "published"]} // ✅ use correct values
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
