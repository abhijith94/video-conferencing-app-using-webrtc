const io = require('socket.io')();

io.on('connection', (socket) => {
  socket.on('peerjsInitialized', (data) => {
    if (data && data.peerId && data.roomId) {
      socket.join(data.roomId, (err) => {
        if (!err) {
          socket.to(data.roomId).emit('newPeer', { peerId: data.peerId });
        }
      });
    }
  });
});

io.listen(3002);
