const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const folderRoutes = require('./routes/folders');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folder', folderRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MERN Auth API' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'test route works' });
});

console.log("Region:", process.env.AWS_REGION);
console.log("Key exists:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("Bucket:", process.env.AWS_BUCKET_NAME);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});