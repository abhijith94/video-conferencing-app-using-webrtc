export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://abhijith.xyz/api';

export const PEERJS_URL =
  process.env.NODE_ENV === 'development' ? 'localhost' : 'abhijith.xyz';

export const SOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3002'
    : 'https://abhijith.xyz';

export const FETCH_MEET_URL = SERVER_URL + '/createMeetUrl';

export const MEET_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://abhijith.xyz';
