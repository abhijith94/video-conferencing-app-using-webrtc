import TYPES from './homeTypes';

const INITIAL_STATE = {
  meetUrl: '',
  urlCopied: false,
  showCopyUrlSection: false,
};

const filterReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.CHAT_URL_COPIED:
      return {
        ...state,
        urlCopied: !state.urlCopied,
      };

    case TYPES.SHOW_COPY_URL_SECTION:
      console.log(action.payload);
      return {
        ...state,
        showCopyUrlSection: true,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default filterReducer;
