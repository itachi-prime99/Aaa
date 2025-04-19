const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Setup Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload route for files
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Sending the file to Catbox
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    const response = await axios.post('https://catbox.moe/user/api.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Extract file URL from Catbox API response
    const fileUrl = response.data.url;
    res.json({ url: fileUrl });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading to Catbox. Please try again later.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
