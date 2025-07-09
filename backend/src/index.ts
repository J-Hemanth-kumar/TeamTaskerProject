import 'reflect-metadata';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import sequelize from './sequelize';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import projectRoutes from './routes/projects';
import commentRoutes from './routes/comments';
import userRoutes from './routes/users';
import userPreferencesRoutes from './routes/userPreferences';
import { registerSocketHandlers } from './sockets';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api', userPreferencesRoutes);
registerSocketHandlers(io);



sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync();
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => console.error('DB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, io, server, sequelize };
