export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'http://abhijith.xyz/api';

export const SOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3002'
    : 'http://abhijith.xyz/socket';

export const FETCH_MEET_URL = SERVER_URL + '/createMeetUrl';

export const MEET_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://abhijith.xyz';
