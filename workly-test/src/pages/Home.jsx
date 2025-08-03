import { useEffect, useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      await axios.post(
        `/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: token } }
      );
      setCommentText({ ...commentText, [postId]: "" });
      getPosts();
    } catch {
      alert("Failed to add comment.");
    }
  };

  const handleSubmit = async () => {
  if (!token) {
    navigate("/login");
    return;
  }

  if (!content.trim()) return;

  try {
    await axios.post(
      "/posts",
      { content },
      {
        headers: { Authorization: token },
      }
    );
    setContent("");
    getPosts();
  } catch {
    alert("Failed to post. Try again.");
  }
};


  return (
    <div className="home-wrapper">
      <section className="post-box">
        <h2>Create Post</h2>
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
          <button onClick={handleSubmit} className="primary-btn">
            Post
          </button>
      </section>

      <section className="feed-section">
        <h3>Latest Posts</h3>
        {posts.length === 0 ? (
          <p className="info-msg">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <p>{post.content}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
              <div className="meta">
                <span>
                  by <strong>{post.author.name}</strong>
                </span>
                <span className="time">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>

              <button
                className="outline-btn"
                onClick={() => navigate(`/profile/${post.author._id}`)}
              >
                View Profile
              </button>

              <div className="comments-section">
                <h4>Comments</h4>
                {post.comments?.map((c, idx) => (
                  <p key={idx}>
                    <strong>{c.user?.name || "Anonymous"}:</strong> {c.text}
                  </p>
                ))}
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [post._id]: e.target.value })
                  }
                />
                <button onClick={() => handleCommentSubmit(post._id)}>
                  Add Comment
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Home;
