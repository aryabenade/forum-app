import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message)

  return data as Post;
}


export const PostDetail = ({ postId }: Props) => {

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId)
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div>Error:{error.message}</div>
  }


  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-bold text-center bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent pb-4">
        {data?.title}
      </h2>

      <div className="flex justify-center">
        {data?.image_url && (
          <img
            src={data.image_url}
            alt={data?.title}
            className=" rounded w-3/4 h-90"
          />
        )}
      </div>
      
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  )
}
