import { Server as SocketIOServer } from 'socket.io';

export function registerSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinProject', (projectId) => {
      socket.join(`project_${projectId}`);
    });

    socket.on('leaveProject', (projectId) => {
      socket.leave(`project_${projectId}`);
    });

    // Example: emit task updates
    socket.on('taskUpdated', (data) => {
      io.to(`project_${data.projectId}`).emit('taskUpdated', data);
    });

    // Example: emit new comments
    socket.on('newComment', (data) => {
      io.to(`project_${data.projectId}`).emit('newComment', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
