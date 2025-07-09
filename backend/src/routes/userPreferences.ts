import express, { Request, Response } from 'express';
import redis from '../redis/redisClient';

const router = express.Router();

router.post('/preferences', async (req: Request, res: Response): Promise<void> => {
  const { userId, preferences } = req.body;

  try {
    await redis.set(`prefs:${userId}`, JSON.stringify(preferences));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

router.get('/preferences/:userId', async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;

  try {
    const data = await redis.get(`prefs:${userId}`);
    if (!data) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

export default router;
