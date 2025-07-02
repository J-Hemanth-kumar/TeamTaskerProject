import { Router } from 'express';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Get all users with their roles (for assignment dropdowns)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['name'] }],
      attributes: ['id', 'name', 'username', 'email', 'roleId'],
    });
    // Flatten role name for frontend
    const result = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.Role?.name || '',
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all developers
router.get('/developers', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['name'] }],
      attributes: ['id', 'name', 'username', 'email', 'roleId'],
    });
    const developers = users.filter((u: any) => u.Role?.name === 'Developer');
    const result = developers.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.Role?.name || '',
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

// Get all testers
router.get('/testers', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['name'] }],
      attributes: ['id', 'name', 'username', 'email', 'roleId'],
    });
    const testers = users.filter((u: any) => u.Role?.name === 'Tester');
    const result = testers.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.Role?.name || '',
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testers' });
  }
});

export default router;
