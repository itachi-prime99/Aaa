const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

// Set up express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Base API URL (update with your base API or the correct path)
const apiBaseUrl = 'https://raw.githubusercontent.com/itachi-prime99/Aaa/main/Apis.json';

// Function to get the base API URL
const csbApi = async () => {
  try {
    const base = await axios.get(apiBaseUrl);
    return base.data.csb; // assuming the Catbox URL is stored here
  } catch (error) {
    console.error('Error fetching base API:', error);
    throw new Error('Could not fetch base API.');
  }
};

// POST route to upload image/video to Catbox
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const baseApi = await csbApi(); // Fetch the API URL

    // Constructing the request to upload to Catbox
    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: req.file.originalname });

    const response = await axios.post(baseApi, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Returning the uploaded file's URL
    res.json({ url: response.data.url });
  } catch (error) {
    console.error('Error uploading to Catbox:', error);
    res.status(500).send('An error occurred while uploading to Catbox.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
