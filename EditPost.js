import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditPost.css'; // Import custom CSS for the edit form

const EditPost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Use navigate hook

  // Fetch the post details when the component mounts
  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then((response) => {
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setImage(post.image); // Set the existing image URL
      })
      .catch((error) => {
        console.error('Error fetching post details:', error);
      });
  }, [id]);

  // Handle form submission and send updated data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('image', file);
    } else {
      formData.append('image', image); // Keep existing image if no new image uploaded
    }

    axios.put(`/api/posts/${id}`, formData)
      .then((response) => {
        console.log('Post updated:', response.data);
        navigate('/'); // Redirect to post list page after update
      })
      .catch((error) => {
        console.error('Error updating post:', error);
      });
  };

  // Handle the back button
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="edit-post">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {image && <img src={image} alt="Post" className="preview-img" />}
        </div>
        {/* Button Container */}
        <div className="button-group">
          <button type="submit" className="btn-update">Update Post</button>
          <button type="button" className="btn-back" onClick={handleBack}>Back</button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
