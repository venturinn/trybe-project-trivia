import { REQUEST_TOKEN, GET_TOKEN_SUCCESS, GET_TOKEN_ERROR } from './index';

const requestToken = () => ({
  type: REQUEST_TOKEN,
});

const getTokenSuccess = (state) => ({
  type: GET_TOKEN_SUCCESS,
  payload: state,
});

const getTokenError = (error) => ({
  type: GET_TOKEN_ERROR,
  payload: error,
});

function fetchToken() {
  const API = 'https://opentdb.com/api_token.php?command=request';
  return async (dispatch) => {
    dispatch(requestToken());
    try {
      const response = await fetch(API);
      const data = await response.json();
      dispatch(getTokenSuccess(data.token));
    } catch (error) {
      dispatch(getTokenError(error.message));
    }
  };
}

export default fetchToken;
