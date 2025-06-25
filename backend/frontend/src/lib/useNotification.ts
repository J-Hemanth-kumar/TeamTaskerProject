import { useEffect, useState } from 'react';

export function useNotification(socket: any) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;
    const handleTaskUpdate = (data: any) => setMessage(`Task updated: ${data.title}`);
    const handleNewTask = (data: any) => setMessage(`New task: ${data.title}`);
    socket.on('taskUpdated', handleTaskUpdate);
    socket.on('newTask', handleNewTask);
    return () => {
      socket.off('taskUpdated', handleTaskUpdate);
      socket.off('newTask', handleNewTask);
    };
  }, [socket]);

  return [message, setMessage] as const;
}
