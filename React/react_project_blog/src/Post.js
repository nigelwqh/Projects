import { Link } from "react-router-dom"

const Post = ({ post, handleDelete }) => {
    return (
        <article className="post">
            <Link to={`/post/${post.id}`}>
                <h2>{post.title}</h2>
                <p>{post.datetime}</p>
            </Link>
            <p className="postBody">
                {post.body.length <= 50 ? post.body : `${post.body.slice(0, 50)}...`}
            </p>
            <hr />
        </article>
    )
}

export default Post
