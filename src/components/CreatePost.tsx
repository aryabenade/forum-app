import React, { useState, type ChangeEvent } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities, type Community } from "./CommunityList";
import { useNavigate } from "react-router";

interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    community_id?: number | null;
}

const sanitizeFileName = (name: string) => {
    return name
        .replace(/[^a-zA-Z0-9-_]/g, "_") // Replace unsafe characters with underscores
        .toLowerCase();
}

const createPost = async (post: PostInput, imageFile: File) => {

    const rawFileName = `${post.title}-${Date.now()}-${imageFile.name}`;
    const filePath = sanitizeFileName(rawFileName);


    const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, imageFile)

    if (uploadError) throw new Error(uploadError.message)


    const { data: publicURLData } = await supabase.storage.from("post-images").getPublicUrl(filePath)

    const { data, error } = await supabase.from("posts").insert({ ...post, image_url: publicURLData.publicUrl }).select()
        .single(); // <-- important

    if (error) throw new Error(error.message)

    return data;
}

export const CreatePost = () => {

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [communityId, setCommunityId] = useState<number | null>(null)
    const navigate = useNavigate()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const { user } = useAuth()

    const { data: communities } = useQuery<Community[], Error>(
        {
            queryKey: ["communities"],
            queryFn: fetchCommunities
        })

    const { mutateAsync, isPending, isError } = useMutation({
        mutationFn: (data: { post: PostInput; imageFile: File }) => {
            return createPost(data.post, data.imageFile);
        },
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) return;

        try {
            const result = await mutateAsync({
                post: {
                    title,
                    content,
                    avatar_url: user?.user_metadata.avatar_url || null,
                    community_id: communityId,
                },
                imageFile: selectedFile,
            });

            console.log(result); // should be the inserted post(s)

            // Supabase insert returns an array of rows by default
            const postId = result?.id;
            if (postId) {
                navigate(`/post/${postId}`);
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };


    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null)
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <div>
                <label htmlFor="title" className="block mb-2 font-medium">Title</label>
                <input type="text" id="title" required
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border-2 border-white/20 bg-transparent p-2 rounded" />
            </div>
            <div>
                <label htmlFor="content" className="block mb-2 font-medium">Content</label>
                <textarea id="content" required rows={5}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border-2 border-white/20 bg-transparent p-2 rounded" />
            </div>


            <div>
                <label htmlFor="community" className="block mb-2 font-medium">Select Community</label>
                <select id="community" onChange={handleCommunityChange} className="bg-black border-2 border-white/20 p-2 rounded w-full">
                    <option value="">Choose a community</option>
                    {communities?.map((community, key) => (
                        <option value={community.id} key={key}>
                            {community.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="image"className="block mb-2 font-medium">Upload Image</label>
                <input type="file" id="image" accept="image/*" required
                    onChange={handleFileChange}
                    className="w-full text-gray-200 border-2 border-white/20 p-2 rounded" />
            </div>

            <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">
                {isPending ? "Creating..." : "Create Post"}</button>

            {isError && <p>Error creating post.</p>}
        </form>
    )
}