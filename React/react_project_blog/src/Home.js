import Feed from "./Feed"

const Home = ({ posts }) => {
    return <main>{posts.length ? <Feed posts={posts} /> : <p>No posts to display.</p>}</main>
}

export default Home
