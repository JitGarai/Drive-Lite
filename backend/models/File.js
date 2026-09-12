const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    key: {
        type: String,
        required: true,
        unique: true
    },

    originalName: {
        type: String,
        required: true
    },

    mimeType: {
        type: String,
        required: true
    },

    size: {
        type: Number,
        required: true
    },

    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null
    },

    sharedWith: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        permission: {
            type: String,
            enum: ["viewer", "editor"],
            default: "viewer"
        },
        
    }],

    isPublic: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema)