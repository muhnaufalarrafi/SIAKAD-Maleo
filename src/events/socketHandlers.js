export default function socketHandlers(socket, io) {
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    io.emit('chat message', msg); // broadcast ke semua client
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
