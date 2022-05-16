import { ADD_PLAYER } from './index';

const addPlayer = (name, email) => ({
  type: ADD_PLAYER,
  payload: {
    name,
    email,
  },
});

export default addPlayer;
