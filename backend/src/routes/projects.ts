import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { Project } from '../models/Project';

const router = Router();

// Get all projects
router.get('/', authenticateJWT, async (req, res) => {
  const projects = await Project.findAll();
  res.json(projects);
});

// Create a project
router.post('/', authenticateJWT, authorizeRoles(['Admin', 'Project Manager']), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: 'Project creation failed', details: err });
  }
});

// Update a project
router.put('/:id', authenticateJWT, authorizeRoles(['Admin', 'Project Manager']), async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await project.update(req.body);
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: 'Project update failed', details: err });
  }
});

// Delete a project
router.delete('/:id', authenticateJWT, authorizeRoles(['Admin']), async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Project deletion failed', details: err });
  }
});

export default router;
