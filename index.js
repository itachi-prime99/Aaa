import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' });

// Home route
app.get('/', (req, res) => {
  res.send('✅ Catbox Upload API is Running!');
});

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('userhash', 'bb55eaffb7479ed3486dd8e4c'); // Your catbox userhash
  form.append('fileToUpload', fs.createReadStream(filePath), fileName);

  try {
    const response = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    // Delete temp file
    fs.unlinkSync(filePath);

    res.json({
      status: 'success',
      link: response.data
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({
      status: 'error',
      message: '❌ Failed to upload to Catbox.'
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
