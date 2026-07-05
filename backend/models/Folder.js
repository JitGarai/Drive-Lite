const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    parentFolder: {
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
    timeseries: true
});

module.exports = mongoose.model('Folder', folderSchema);