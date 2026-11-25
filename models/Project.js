const { Schema, model } = require('mongoose');

// Define the project schema with validation and ownership
const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create and export the Project model
const Project = model('Project', projectSchema);

module.exports = Project;