const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Welcome to Eren's Catbox Uploader API!");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("userhash", "bb55eaffb7479ed3486dd8e4c"); // Use your own hash
  form.append("fileToUpload", fs.createReadStream(req.file.path));

  try {
    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    return res.json({ url: response.data });
  } catch (error) {
    console.error("Upload failed:", error.message);
    return res.status(500).json({ error: "Failed to upload to Catbox." });
  }
});

app.listen(port, () => {
  console.log(`Catbox API running on port ${port}`);
});
