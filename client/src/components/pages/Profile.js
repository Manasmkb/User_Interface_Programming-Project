import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../../main";
import UserContext from "../../context/userContext";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      if (!user?.authenticated || !user?.userId) {
        setLoading(false);
        return;
      }

      try {
        const userPosts = await fetchData(`/post/getPostsByAuthor/${user.userId}`, {}, "GET");
        setPosts(Array.isArray(userPosts) ? userPosts : []);
      } catch (err) {
        setError(err?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user?.userId || !user?.username) {
      setError("User session data is missing. Please login again.");
      return;
    }
    if (!newPost.trim()) {
      return;
    }

    try {
      const createdPost = await fetchData(
        "/post/insert",
        {
          content: newPost.trim(),
          authorId: user.userId,
          authorName: user.username
        },
        "POST"
      );

      setPosts((prevPosts) => [createdPost, ...prevPosts]);
      setNewPost("");
      setError("");
    } catch (err) {
      setError(err?.error || err?.message || "Failed to create post");
    }
  };

  if (!user?.authenticated) {
    return (
      <div className="main-container">
        <div className="form-card">
          <h2 className="text-center">Profile</h2>
          <p>Please login first to view your profile.</p>
          <Link className="btn btn-primary btn-style" to="/login">
            Go To Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="form-card" style={{ width: "min(700px, 95vw)" }}>
        <h2 className="text-center">Profile</h2>
        <p>
          <strong>Username:</strong> {user.username || "Unknown"}
        </p>

        <form onSubmit={handleCreatePost}>
          <div className="mb-3">
            <label htmlFor="new-post-content">Create a Post</label>
            <textarea
              id="new-post-content"
              className="form-control input-style"
              placeholder="Write your post..."
              rows={4}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success btn-style w-100">
            Add Post
          </button>
        </form>

        {error ? <p className="text-danger mt-3">{error}</p> : null}

        <hr />
        <h5>Your Posts</h5>

        {loading ? <p>Loading posts...</p> : null}

        {!loading && posts.length === 0 ? <p>No posts yet.</p> : null}

        {!loading && posts.length > 0 ? (
          <ul className="list-group">
            {posts.map((post) => (
              <li key={post._id || `${post.content}-${post.createdAt}`} className="list-group-item">
                <p className="mb-1">{post.content}</p>
                <small className="text-muted">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                </small>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
