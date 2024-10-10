import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Createpost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);  // Added state for image

  // Handle form submission and send data to backend
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object to send text and file
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    // Send the data to the backend
    axios.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important to set the content type
      },
    })
      .then(response => {
        console.log('Post created:', response.data);
        toast.success("Created Successfully");
        setTitle('');
        setContent('');
        setImage(null);  // Reset image after successful post
      })
      .catch(error => {
        console.error('There was an error creating the post!', error);
        toast.error('Error creating post');
      });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div class="body">
      <form onSubmit={handleSubmit}>
        <h2>Create a new post</h2>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div>
          <input
            type="file"
            accept="image/*"  // Restrict to image files
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
