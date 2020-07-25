import io from 'socket.io-client';
import { SOCKET_URL } from '../config';

class Socket {
  instance = null;

  constructor() {
    if (Socket.instance instanceof Socket) {
      return Socket.instance;
    }

    this.socket = io(SOCKET_URL);
    Socket.instance = this;
  }
}

export default Socket;
