import { Router, Request, Response } from 'express';
import { authenticateJWT, authorizeRoles, AuthRequest } from '../middleware/auth';
import { Project } from '../models/Project';

const router = Router();

// Get all projects
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const projects = await Project.findAll();
  res.json(projects);
});

// Create a project
router.post('/', authenticateJWT, authorizeRoles([1, 2]), async (req: AuthRequest, res: Response) => {
  try {
    const project = Project.build(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: 'Project creation failed', details: err });
  }
});

// Update a project
router.put('/:id', authenticateJWT, authorizeRoles([1, 2]), async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    await project.update(req.body);
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: 'Project update failed', details: err });
  }
});

// Delete a project
router.delete('/:id', authenticateJWT, authorizeRoles([1]), async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Project deletion failed', details: err });
  }
});

export default router;
