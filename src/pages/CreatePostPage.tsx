import { CreatePost } from "../components/CreatePost"
import { useAuth } from "../context/AuthContext"

export const CreatePostPage = () => {

  const { user } = useAuth()

return (
     <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent pb-4">
       { user ? "Create a Post" : "Sign in to create a post" }
      </h2>
     {user && <CreatePost />}
    </div>
)
}