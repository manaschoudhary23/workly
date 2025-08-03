import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/api";
import "../styles/Profile.css";

function Profile({ isMe = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const endpoint = isMe ? "/users/me" : `/users/${id}`;
      const token = localStorage.getItem("token");

      const userRes = await axios.get(endpoint, {
        headers: isMe ? { Authorization: token } : {},
      });

      const postsRes = await axios.get(
        isMe ? "/posts/me" : `/posts/user/${id}`,
        {
          headers: isMe ? { Authorization: token } : {},
        }
      );

      setUser(userRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error("Error loading profile", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) return (
  <div className="loading-screen">
    <div className="spinner" />
  </div>
);

  if (!user) return <div className="profile-page">User not found.</div>;

  return (
    <div className="profile-container fade-in">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name[0].toUpperCase()}
        </div>
        <div className="profile-details">
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          {user.bio && <p className="profile-bio">"{user.bio}"</p>}
        </div>
      </div>

      <div className="posts-section slide-up">
        <h2>User Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <p>{post.content}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="post" className="post-image" />
              )}
              <span className="post-time">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
