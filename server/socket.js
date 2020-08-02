const io = require('socket.io')();

io.on('connection', (socket) => {
  let room_id = null;
  let peer_id = null;

  socket.on('join-room', (data) => {
    if (data && data.peerId && data.roomId) {
      room_id = data.roomId;
      peer_id = data.peerId;

      socket.join(room_id, (err) => {
        if (!err) {
          socket
            .to(room_id)
            .emit('new-peer-connected', { peerId: data.peerId });
        }
      });
    }
  });

  socket.on('disconnect', () => {
    io.to(room_id).emit('peer-disconnected', { peerId: peer_id });
  });
});

io.listen(3002);
