import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetails.css'; // Custom SCSS for the detailed view
import './loading.css'; // Loading spinner CSS
import { toast } from 'react-hot-toast';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(response => {
        setPost(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching post details:', error);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      axios.delete(`/api/posts/${id}`)
        .then(() => {
          toast.success('Post deleted successfully');
          navigate('/'); // Redirect to the homepage after deletion
        })
        .catch(error => {
          console.error('Error deleting post:', error);
          toast.error('Error deleting post');
        });
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`); // Navigate to the edit page
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="wrapper">
          <div className="dot"></div>
          <span className="text">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="post-details container">
      {post ? (
        <div className="post-content">
          <h1>{post.title}</h1>
          {post.image && (
            <img src={post.image} alt={post.title} className="post-image" />
          )}
          <p className="post-body">{post.content}</p>
          <small className="post-date">
            Posted on {new Date(post.createdAt).toLocaleDateString()}
          </small>
          <div className="action-buttons">
            <button className="btn-edit" onClick={handleEdit}>Edit</button>
            <button className="btn-delete" onClick={handleDelete}>Delete</button>
            <button className="btn-back" onClick={handleBack}>Back</button> {/* Back Button */}
          </div>
        </div>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
};

export default PostDetails;
