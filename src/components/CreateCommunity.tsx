import { useMutation, useQueryClient } from "@tanstack/react-query"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface CommunityInput {
    name: string;
    description: string;
}

const createCommunity = async (community: CommunityInput) => {
    const { error, data } = await supabase.from("communities").insert(community)

    if (error) throw new Error(error.message)
    return data
}

export const CreateCommunity = () => {

    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const { mutate, isPending, isError } = useMutation({
        mutationFn: createCommunity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["communities"] })
            navigate('/communities')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate({ name, description })
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <h2 className="mb-6 py-3 text-6xl font-bold text-center text-transparent bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text">
                Create New Community
            </h2>
            <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                    Community Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-transparent border-2 border-white/20 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block mb-2 font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 bg-transparent border-2 border-white/20 rounded"
                    rows={3}
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 text-white bg-purple-500 rounded cursor-pointer"
            >
                {isPending ? "Creating..." : "Create Community"}
            </button>
            {isError && <p className="text-red-500">Error creating community.</p>}
        </form>
    )
}