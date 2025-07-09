import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { Comment } from '../models/Comment';

const router = Router();

// Get all comments for a task
router.get('/task/:taskId', authenticateJWT, async (req, res): Promise<void> => {
  const comments = await Comment.findAll({ where: { taskId: req.params.taskId } });
  res.json(comments);
});

// Add a comment to a task
router.post('/', authenticateJWT, authorizeRoles(['Admin', 'Developer', 'Tester']), async (req, res): Promise<void> => {
  try {
    const comment = Comment.build(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Comment creation failed', details: err });
  }
});

export default router;
