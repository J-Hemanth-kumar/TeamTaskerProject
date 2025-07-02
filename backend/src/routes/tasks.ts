import { Router } from 'express';
import { io } from '../index';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { Task } from '../models/Task';

const router = Router();

// Get all tasks (with optional filters)
router.get('/', authenticateJWT, async (req, res) => {
  // Add filters for status, deadline, assignee if needed
  const tasks = await Task.findAll();
  res.json(tasks);
});

// Create a task

router.post('/', authenticateJWT, authorizeRoles(['Admin', 'Project Manager']), async (req, res) => {
  try {
    const task = await Task.create(req.body);
    // Emit newTask event to all clients
    io.emit('newTask', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Task creation failed', details: err });
  }
});

// Update a task

router.put('/:id', authenticateJWT, authorizeRoles(['Admin', 'Project Manager', 'Developer']), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.update(req.body);
    // Emit taskUpdated event to all clients
    io.emit('taskUpdated', task);
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Task update failed', details: err });
  }
});

// Delete a task
router.delete('/:id', authenticateJWT, authorizeRoles(['Admin', 'Project Manager']), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Task deletion failed', details: err });
  }
});

export default router;
