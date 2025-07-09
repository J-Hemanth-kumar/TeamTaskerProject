import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

// ✅ Middleware should return void, and stop execution with `return` after res.send
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        res.sendStatus(403);
        return; // ✅ Prevents execution after sending response
      }
      req.user = user;
      next(); // ✅ Only continue if successful
    });
  } else {
    res.sendStatus(401);
    return; // ✅ Same here — stop execution
  }
}

export const authorizeRoles = (roleIds: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roleIds.includes(req.user.roleId)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
};
