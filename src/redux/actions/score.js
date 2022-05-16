import { ADD_SCORE } from './index';

const addScore = (score, assertions) => ({
  type: ADD_SCORE,
  payload: {
    score,
    assertions,
  },
});

export default addScore;
