const router = require('express').Router();
const { isValidObjectId } = require('mongoose');
const { Project, Task } = require('../../models');
const { authMiddleware } = require('../../utils/auth');

// Protect all project routes with authentication middleware
router.use(authMiddleware);

// Create a project owned by the authenticated user
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body || {};

        const project = await Project.create({
            name,
            description,
            user: req.user._id
        });

        return res.status(201).json(project);
    } catch (err) {
        // Handle schema validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            });
        }

        return res.status(500).json({
            message: 'Unable to create project'
        });
    }
});

// Retrieve all projects owned by the authenticated user
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({
            user: req.user._id
        });

        return res.status(200).json(projects);
    } catch (err) {
        return res.status(500).json({
            message: 'Unable to retrieve projects'
        });
    }
});

// Retrieve a specific project after verifying ownership
router.get('/:id', async (req, res) => {
    try {
        // Validate the project ID
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const project = await Project.findById(req.params.id);

        // Verify that the project exists
        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        // Prevent access to projects owned by another user
        if (project.user.toString() !== req.user._id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        return res.status(200).json(project);
    } catch (err) {
        return res.status(500).json({
            message: 'Unable to retrieve project'
        });
    }
});

// Update a project after verifying ownership
router.put('/:id', async (req, res) => {
    try {
        // Validate the project ID
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const project = await Project.findById(req.params.id);

        // Verify that the project exists
        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        // Prevent unauthorized project modifications
        if (project.user.toString() !== req.user._id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        const { name, description } = req.body || {};

        // Update only permitted fields
        if (name !== undefined) {
            project.name = name;
        }

        if (description !== undefined) {
            project.description = description;
        }

        await project.save();

        return res.status(200).json(project);
    } catch (err) {
        // Handle schema validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            });
        }

        return res.status(500).json({
            message: 'Unable to update project'
        });
    }
});

// Delete a project after verifying ownership
router.delete('/:id', async (req, res) => {
    try {
        // Validate the project ID
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const project = await Project.findById(req.params.id);

        // Verify that the project exists
        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        // Prevent unauthorized project deletion
        if (project.user.toString() !== req.user._id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Delete associated tasks before deleting the project
        await Task.deleteMany({
            project: project._id
        });

        await project.deleteOne();

        return res.status(200).json({
            message: 'Project deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Unable to delete project'
        });
    }
});

// Export the project routes
module.exports = router;