import { combineReducers } from 'redux';
import homeReducer from './home/homeReducer';

const rootReducer = combineReducers({ home: homeReducer });

export default rootReducer;
