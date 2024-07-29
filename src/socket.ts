import { Message } from '@prisma/client';
import http from 'http';
import { Server, Socket } from 'socket.io';
import app from './app';
import { MessageValidation } from './app/modules/message/message.validation';
const socketServer = http.createServer(app);
const io = new Server(socketServer);

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Handle join room event
  socket.on('join-room', async (groupId: string | string[]) => {
    // Join the specified chat group room
    console.log(groupId);
    if (groupId) {
      socket.join(groupId);
      console.log(`User joined room ${groupId}`);
    }

    // Fetch and send previous messages in the room
  });

  // Handle new message event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket.on('send-message', async (message: Message) => {
    // Save the message to the database
    // Send the new message to all users in the chat group room
    try {
      console.log(message);
      await MessageValidation.createValidation.parseAsync({
        body: message,
      });
      io.to(message.orderId).emit('receive-message', message);
    } catch (err) {
      console.error(err);
    }
  });
  // Handle join room event
  socket.on('leave-room', async (orderId: string) => {
    // Join the specified chat group room
    if (orderId) {
      socket.leave(orderId);
      console.log(`User leave room ${orderId}`);
    }

    // Fetch and send previous messages in the room
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
export default socketServer;
