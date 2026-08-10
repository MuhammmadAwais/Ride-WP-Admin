import { io, Socket } from 'socket.io-client';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.ridewithpals.com/api';
// Strip quotes just in case they are parsed as literal characters from .env
const envSocketUrl = import.meta.env.VITE_APP_SOCKET_URL?.replace(/^["']|["']$/g, '');
const SOCKET_URL = envSocketUrl || new URL(apiBase).origin;

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

export const initializeSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      },
      query: {
        token: token
      },
      autoConnect: true,
      transports: ['polling', 'websocket'], // Polling first is required for extraHeaders in browser
    });

    socket.on('connect', () => {
      console.log('✅ [Socket Connected]', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ [Socket Disconnected]', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ [Socket Connection Error]', error);
    });

    // Intercept and log all incoming events
    socket.onAny((event, ...args) => {
      console.log(`📥 [Socket Response] ${event}`, ...args);
    });

    // Intercept and log all outgoing events
    socket.onAnyOutgoing((event, ...args) => {
      console.log(`📤 [Socket Request] ${event}`, ...args);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
