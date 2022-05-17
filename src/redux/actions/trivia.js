import { REQUEST_TRIVIA, GET_TRIVIA_SUCCESS, GET_TRIVIA_ERROR } from './index';

const requestTrivia = () => ({
  type: REQUEST_TRIVIA,
});

const getTriviaSuccess = (responseCode, results) => ({
  type: GET_TRIVIA_SUCCESS,
  payload: { responseCode, results },
});

const getTriviaError = (error) => ({
  type: GET_TRIVIA_ERROR,
  payload: error,
});

function fetchTrivia(token) {
  const TRIVIA = `https://opentdb.com/api.php?amount=5&token=${token}`;
  return async (dispatch) => {
    dispatch(requestTrivia());
    try {
      const response = await fetch(TRIVIA);
      const data = await response.json();
      dispatch(getTriviaSuccess(data.response_code, data.results));
    } catch (error) {
      dispatch(getTriviaError(error.message));
    }
  };
}

export default fetchTrivia;
