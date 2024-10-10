const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // Multer for handling file uploads
const path = require('path');
const Post = require('./Models/Post'); // Your Mongoose model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb+srv://Diya_17:diya17@cluster0.rbp1o.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save the images in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give a unique name to the file
  }
});

const upload = multer({ storage: storage });

// API Routes

// Create a new post with an image
app.post('/api/posts', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Save image path if available

  try {
    const newPost = new Post({ title, content, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post', details: error.message });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts from MongoDB
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get a single post by ID
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id); // Fetch the post by its MongoDB ObjectId
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ error: 'Error fetching post by ID' });
  }
});

// Delete a post by ID
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id); // Delete post from DB
    if (deletedPost) {
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// // Update a post by ID
// app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
//   const { id } = req.params;
//   const { title, content } = req.body;

//   // Determine image path: if a new image is uploaded, use that; otherwise, use the old image path from the request body
//   let imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;

//   try {
//     // Find the post by ID and update it
//     const updatedPost = await Post.findByIdAndUpdate(
//       id,
//       { title, content, image: imagePath }, // Update title, content, and image path
//       { new: true } // Ensure the updated post is returned
//     );

//     // Check if the post was found and updated
//     if (updatedPost) {
//       res.status(200).json(updatedPost);
//     } else {
//       res.status(404).json({ error: 'Post not found' });
//     }
//   } catch (error) {
//     console.error('Error updating post:', error);
//     res.status(500).json({ error: 'Error updating post' });
//   }
// });

// Update a post by ID
app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Determine image path: if a new image is uploaded, use that; otherwise, use the old image path from the request body
  let imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, image: imagePath }, // Update title, content, and image path
      { new: true } // Ensure the updated post is returned
    );

    // Check if the post was found and updated
    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Error updating post' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
