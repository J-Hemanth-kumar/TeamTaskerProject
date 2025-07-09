import { Router } from 'express';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Get all users with their roles (for assignment dropdowns)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'role', attributes: ['name', 'id'] }],
      attributes: ['id', 'name', 'email', 'roleId'],
    });
    // Return both roleId and role name for frontend
    const result = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role?.name || '',
      roleId: u.roleId,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all developers
router.get('/developers', authenticateJWT, async (req, res) => {
  try {
    const developers = await User.findAll({
      where: { roleId: 3 }, // 3 = Developer
      attributes: ['id', 'name', 'email', 'roleId'],
    });
    res.json(developers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

// Get all testers
router.get('/testers', authenticateJWT, async (req, res) => {
  try {
    const testers = await User.findAll({
      where: { roleId: 4 }, // 4 = Tester
      attributes: ['id', 'name', 'email', 'roleId'],
    });
    res.json(testers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testers' });
  }
});

export default router;
