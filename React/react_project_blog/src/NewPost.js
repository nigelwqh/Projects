const NewPost = ({ postTitle, setPostTitle, postBody, setPostBody, handleSubmit }) => {
    return (
        <main className="NewPost">
            <form className="newPostForm" onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Title: </label>
                <input
                    id="postTitle"
                    type="text"
                    placeholder="Enter Post Title"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />
                <label htmlFor="postBody">Body:</label>
                <textarea
                    id="postBody"
                    placeholder="Enter Post Body"
                    required
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                />
                <div className="buttonContainer">
                    <button type="submit">Submit</button>
                </div>
            </form>
            {/* <h1>New Post</h1> */}
        </main>
    )
}

export default NewPost
