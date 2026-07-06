import { Route, Routes, useLocation, useNavigate } from "react-router"
import { Home } from "./pages/Home"
import { Navbar } from "./components/Navbar"
import { CreatePostPage } from "./pages/CreatePostPage"
import { PostPage } from "./pages/PostPage"
import { CreateCommunityPage } from "./pages/CreateCommunityPage"
import { CommunitiesPage } from "./pages/CommunitiesPage"
import { CommunityPage } from "./pages/CommunityPage"
import { ArrowLeftIcon } from "lucide-react"

const App = () => {
  const navigate = useNavigate()
  const location= useLocation()
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />
    {location.pathname !== "/" && (
      <button onClick={() => navigate(-1)}
        className="text-xl hover:text-gray-200 text-gray-400 font-semibold py-2 px-4 rounded cursor-pointer flex items-center">
        <ArrowLeftIcon className="w-5 h-5 inline-block mr-1 mt-1" strokeWidth={"3px"} />
        Back
      </button>
    )}
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App