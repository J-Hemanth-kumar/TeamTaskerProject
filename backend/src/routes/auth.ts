import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { Role } from '../models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name, roleId } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password: hashedPassword, name, roleId });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const role = await Role.findByPk(user.roleId);
  const token = jwt.sign({ id: user.id, role: role?.name }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: role?.name } });
});

export default router;
