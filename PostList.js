import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PostList.css'; // Import custom styles
import './loading.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/posts')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div><div class="wrapper">
  <div class="dot"></div>
  <span class="text">
    Loading
  </span>
</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Blog Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center">No posts found.</p>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="card-img-top post-image"
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">
                    {post.content.substring(0, 100)}... {/* Show a preview */}
                  </p>
                  <Link to={`/posts/${post._id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
                <div className="card-footer">
                  <small className="text-muted">Posted on {new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
