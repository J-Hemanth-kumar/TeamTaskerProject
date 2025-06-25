import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket(token?: string) {
  useEffect(() => {
    if (!socket) {
      socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: { token },
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [token]);
  return socket;
}
