import { Router, Request, Response } from 'express';
import { io } from '../index';
import { authenticateJWT, authorizeRoles, AuthRequest } from '../middleware/auth';
import { Task } from '../models/Task';

const router = Router();

// Get all tasks
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

// Create a task
router.post('/', authenticateJWT, authorizeRoles([1, 2]), async (req: AuthRequest, res: Response) => {
  try {
    const task = Task.build(req.body);
    await task.save();
    io.emit('newTask', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Task creation failed', details: err });
  }
});

// Update a task
router.put('/:id', authenticateJWT, authorizeRoles([1, 2, 3]), async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    await task.update(req.body);
    io.emit('taskUpdated', task);
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Task update failed', details: err });
  }
});

// Delete a task
router.delete('/:id', authenticateJWT, authorizeRoles([1, 2]), async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Task deletion failed', details: err });
  }
});

export default router;
