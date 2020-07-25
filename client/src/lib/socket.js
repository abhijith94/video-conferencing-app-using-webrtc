import io from 'socket.io-client';
import { SOCKET_URL } from '../config';

class Socket {
  instance = null;

  constructor() {
    if (this.instance instanceof Socket) {
      return this.instance;
    }

    this.socket = io(SOCKET_URL);
    this.instance = this;
  }
}

export default Socket;
