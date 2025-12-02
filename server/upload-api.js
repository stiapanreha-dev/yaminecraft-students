/**
 * Simple Express server for uploading images to MinIO
 * Run with: node server/upload-api.js
 */

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { Client } from 'minio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://stiapanreha-dev.github.io'],
  credentials: true
}));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Configure MinIO client
const minioClient = new Client({
  endPoint: 'storage.sh3.su',
  port: 443,
  useSSL: true,
  accessKey: 'JOiCOGJU3b4Tf88Xxbxp',
  secretKey: 'T6cWSFfHbrUYVtrdTaB1CnAcrjlmkgM1XJUvVtCD'
});

const BUCKET_NAME = 'student-photos';

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileBuffer = req.file.buffer;
    const contentType = req.file.mimetype;

    // Upload to MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      fileBuffer,
      fileBuffer.length,
      {
        'Content-Type': contentType
      }
    );

    // Generate public URL
    const url = `https://storage.sh3.su/${BUCKET_NAME}/${fileName}`;

    res.json({
      success: true,
      url: url,
      fileName: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Upload API running on http://localhost:${PORT}`);
  console.log(`MinIO endpoint: storage.sh3.su`);
  console.log(`Bucket: ${BUCKET_NAME}`);
});
