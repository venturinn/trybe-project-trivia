import { REQUEST_TOKEN, GET_TOKEN_SUCCESS, GET_TOKEN_ERROR } from '../actions';

const INITIAL_STATE = '';

const token = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_TOKEN:
    return {
      ...state,
    };
  case GET_TOKEN_SUCCESS:
    localStorage.setItem('token', action.payload);
    return action.payload;

  case GET_TOKEN_ERROR:
    return {
      ...state,
      errorMessage: action.payload,
    };
  default:
    return state;
  }
};

export default token;
