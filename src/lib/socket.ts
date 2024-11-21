import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.PROD 
  ? 'https://moviematcher-production.up.railway.app'  // We'll update this after backend deployment
  : 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
});