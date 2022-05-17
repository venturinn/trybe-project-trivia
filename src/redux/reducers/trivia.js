import { REQUEST_TRIVIA, GET_TRIVIA_SUCCESS, GET_TRIVIA_ERROR } from '../actions';

const INITIAL_STATE = {
  responseCode: '',
  results: '',
};

const trivia = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_TRIVIA:
    return {
      ...state,
    };
  case GET_TRIVIA_SUCCESS:
    return {
      ...state,
      responseCode: action.payload.responseCode,
      results: action.payload.results,
    };

  case GET_TRIVIA_ERROR:
    return {
      ...state,
      errorMessage: action.payload,
    };
  default:
    return state;
  }
};

export default trivia;
