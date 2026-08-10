const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const folder = require("../models/Folder");
const Folder = require("../models/Folder");

router.post("/", authMiddleware, async (req, res) => {
    const {name, parentFolder} = req.body;
    const folder = await Folder.create({
        name,
        owner: req.user.userId,
        parentFolder: parentFolder || null
    })

    res.status(201).json(folder);
})

router.get("/", authMiddleware, async (req, res) => {
    const { parentFolder } = req.query;
    const folder = await Folder.find({
        owner: req.user.userId,
        parentFolder: parentFolder || null,
    })

    res.json(folder);
})

module.exports = router;