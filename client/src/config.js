export const SERVER_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3001' : '';

export const FETCH_MEET_URL = SERVER_URL + '/createRoom';
