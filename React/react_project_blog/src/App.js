import Header from "./Header"
import Nav from "./Nav"
import Home from "./Home"
import NewPost from "./NewPost"
import Feed from "./Feed"
import About from "./About"
import Footer from "./Footer"
import "./Header.css"
import "./Nav.css"
import "./Post.css"
import "./NewPost.css"
import "./About.css"
import "./Footer.css"
import { Route, Routes, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { format } from "date-fns"

function App() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "My First Post",
            datetime: "July 01, 2021 11:17:36 AM",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
        },
        {
            id: 2,
            title: "My 2nd Post",
            datetime: "July 01, 2021 11:17:36 AM",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
        },
        {
            id: 3,
            title: "My 3rd Post",
            datetime: "July 01, 2021 11:17:36 AM",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
        },
        {
            id: 4,
            title: "My Fourth Post",
            datetime: "July 01, 2021 11:17:36 AM",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
        },
        {
            id: 5,
            title: "My Fifth Post",
            datetime: "July 01, 2021 11:17:36 AM",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
        },
    ])
    const [searchValue, setSearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [postTitle, setPostTitle] = useState("")
    const [postBody, setPostBody] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const filteredResults = posts.filter(
            (post) =>
                post.body.toLowerCase().includes(searchValue.toLowerCase()) ||
                post.title.toLowerCase().includes(searchValue.toLowerCase())
        )
        setSearchResults(filteredResults.reverse())
    }, [posts, searchValue])

    const handleSubmit = (e) => {
        e.preventDefault()
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1
        const datetime = format(new Date(), "MMMM dd, yyyy pp")
        const newPost = { id, title: postTitle, datetime, body: postBody }
        const allPosts = [...posts, newPost]
        setPosts(allPosts)
        setPostTitle("")
        setPostBody("")
        navigate("/")
    }

    return (
        <div className="App">
            <Header title="Nigel's Blog" />
            <Nav searchValue={searchValue} setSearchValue={setSearchValue} />
            <Routes>
                <Route path="/" element={<Home posts={searchResults} />} />
                <Route
                    path="/post"
                    element={
                        <NewPost
                            postTitle={postTitle}
                            setPostTitle={setPostTitle}
                            postBody={postBody}
                            setPostBody={setPostBody}
                            handleSubmit={handleSubmit}
                        />
                    }
                />
                <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App
