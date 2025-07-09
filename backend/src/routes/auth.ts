import { Router, Request, Response } from 'express';
import { User, UserCreationAttributes } from '../models/User';
import { Role } from '../models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, roleId } = req.body as UserCreationAttributes;

  if (!email || !password || !name || !roleId) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const user = await User.create({ email, password, name, roleId });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email });

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({
    where: { email },
    attributes: ['id', 'email', 'password', 'name', 'roleId'],
  });
  console.log('Sequelize raw user:', user?.toJSON?.());

  if (!user) {
    console.log('User not found');
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  console.log('Password match:', isValid);

  if (!isValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const role = await Role.findByPk(user.roleId);

  const token = jwt.sign(
    { id: user.id, name: user.name, role: role?.name, roleId: user.roleId },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: role?.name,
      roleId: user.roleId,
    },
  });
});

// Admin creates a user
router.post(
  '/admin/create-user',
  authenticateJWT,
  authorizeRoles([1]), // Replace 1 with the actual Admin role ID if different
  async (req: Request, res: Response) => {
    const { email, password, name, roleId } = req.body as UserCreationAttributes;

    if (!email || !password || !name || !roleId) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    try {
      const user = await User.create({ email, password, name, roleId });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
      res.status(400).json({ error: 'User creation failed', details: err });
    }
  }
);

export default router;
