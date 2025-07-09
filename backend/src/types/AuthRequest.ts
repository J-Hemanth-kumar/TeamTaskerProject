import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    // Add other custom properties if needed
  };
}
