const express = require("express");
const router = express.Router();
const {v4: uuidv4} = require("uuid");
const {PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const s3 = require("../config/s3Client");
const authMiddleware = require("../middleware/authMiddleware");
const File = require("../models/File");

router.post("/generate-upload-url", authMiddleware, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    console.log("Received:", fileName, fileType);

    const key = `users/${req.user.userId}/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.json({ uploadUrl, key });
  } catch (err) {
    console.error("generate-upload-url error:", err); // THIS will tell us the real problem
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
    const {key, originalName, mimeType, size, folder} = req.body;

    const file = await File.create({
        owner: req.user.userId,
        key,
        originalName,
        mimeType,
        size,
        folder: folder || null,
    })

    res.status(201).json(file);
})

router.get('/', authMiddleware, async (req, res) => {
    const { folder } = req.query
    const files = await File.find({
        owner: req.user.userId,
        folder: folder || null,
    })
    res.json(files);
})

router.get('/:id/download-url', authMiddleware, async (req, res) => {
    const file = await File.findById(req.params.id);
    if(!file) return res.status(404).json({
        error: "File not found",
    })

    const hasAccess = file.owner.equals(req.user.userId) || file.sharedWith.includes(req.user.userId) || file.isPublic;
    if(!hasAccess) return res.status(403).json({
        error: "Acess denied",
    })

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
    })

    const downloadUrl = await getSignedUrl(s3, command, {expiresIn: 300});
    res.json({downloadUrl});
})

router.delete('/:id', authMiddleware, async (req, res) => {
    const file = await File.findById(req.params.id);

    if(!file) return res.status(404).json({error: "File not found"});

    if(!file.owner.equals(req.user.userId)) return res.status(403).json({error: "Access denied"});

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
    })
    await s3.send(command);
    await file.deleteOne();

    res.json({message: "File deleted"});
})

module.exports = router;