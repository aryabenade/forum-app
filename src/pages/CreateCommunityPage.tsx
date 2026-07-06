import { CreateCommunity } from "../components/CreateCommunity"
import { useAuth } from "../context/AuthContext"

export const CreateCommunityPage = () => {
    const { user } = useAuth()
    return (
        <div className="pt-20">
            <h2 className="mb-6 py-3 text-6xl font-bold text-center text-transparent bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text">
                { user ? "Create New Community" : "Sign in to create new community" }
            </h2>
            {user && <CreateCommunity />}
        </div>
    )
}