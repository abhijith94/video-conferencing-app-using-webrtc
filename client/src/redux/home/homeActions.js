import TYPES from './homeTypes';

export const copyUrlClicked = () => ({
  type: TYPES.CHAT_URL_COPIED,
});

export const showCopyUrlSection_ = (data) => ({
  type: TYPES.SHOW_COPY_URL_SECTION,
  payload: data,
});
