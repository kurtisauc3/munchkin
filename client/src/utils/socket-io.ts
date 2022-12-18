import { io } from 'socket.io-client';

const { SERVER_URL } = process.env;
const socketIo = io(SERVER_URL, {
  autoConnect: true, // TODO: remove this
  transports: ['websocket']
});
socketIo.on('connect_error', (error) => console.log('[socket.io-client] Connect to server error', error));

export { socketIo };
