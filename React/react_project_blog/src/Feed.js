import Post from "./Post"

const Feed = ({ posts, handleDelete }) => {
    return (
        <>
            {posts.map((post) => (
                <Post key={post.id} post={post} handleDelete={handleDelete} />
            ))}
        </>
    )
}

export default Feed
