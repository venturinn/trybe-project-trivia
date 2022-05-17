import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import fetchTrivia from '../redux/actions/trivia';
import TriviaQuestions from '../components/TriviaQuestions';
import addScore from '../redux/actions/score';

let interval = '';
let timeout = '';

class Game extends React.Component {
    state = {
      redirectToLogin: false,
      questionIndex: 0,
      timer: 30,
      isDisabledAlternatives: false,
      styleTrue: {},
      styleFalse: {},
      score: 0,
      assertions: 0,
    }

    async componentDidMount() {
      const { triviaDispatch } = this.props;
      const token = localStorage.getItem('token');
      await triviaDispatch(token);
      this.timer();
    }

    timer = () => {
      this.setState({ isDisabledAlternatives: false });
      const timeTimeout = 30000;
      const timeInterval = 1000;
      interval = setInterval(
        () => {
          this.setState(
            (previous) => ({ timer: previous.timer - 1 }),
          );
        }, timeInterval,
      );
      timeout = setTimeout(() => { this.endTime(); }, timeTimeout);
    }

    endTime = () => {
      this.setState({ isDisabledAlternatives: true });
      clearInterval(interval);
      clearTimeout(timeout);
    };

    isTokenValid = (triviaResponseCode) => {
      const tokenExpireCode = 3;
      if (triviaResponseCode === tokenExpireCode) {
        localStorage.clear();
        this.setState({ redirectToLogin: true });
      }
    }

    onClickAltenatives = ({ target }) => {
      const { questionIndex, timer } = this.state;
      this.setState(
        { styleTrue: { border: '3px solid rgb(6, 240, 15)' },
          styleFalse: { border: '3px solid rgb(255, 0, 0)' } },
      );

      if (target.name === 'correct') {
        const { addPlayerScore, triviaResults } = this.props;
        const { difficulty } = triviaResults[questionIndex];
        const scoreToAllQuestions = 10;
        const hardNumer = 3;
        const mediumNumber = 2;
        let difficultyNumer = 1;

        if (difficulty === 'medium') {
          difficultyNumer = mediumNumber;
        } else if (difficulty === 'hard') {
          difficultyNumer = hardNumer;
        }

        const saveScoreGlobalState = () => {
          const { score, assertions } = this.state;
          addPlayerScore(score, assertions);
        };

        this.setState((previous) => ({
          score: previous.score + (scoreToAllQuestions + (timer * difficultyNumer)),
          assertions: previous.assertions + 1,
        }), saveScoreGlobalState);
      }
    };

    render() {
      const { redirectToLogin,
        questionIndex,
        timer,
        isDisabledAlternatives,
        styleTrue,
        styleFalse,
      } = this.state;
      const { triviaResults, triviaResponseCode } = this.props;

      this.isTokenValid(triviaResponseCode);

      if (redirectToLogin) {
        return <Redirect to="/" />;
      }
      return (
        <div>
          <Header />
          <TriviaQuestions
            question={ triviaResults[questionIndex] }
            isDisabledAlternatives={ isDisabledAlternatives }
            styleTrue={ styleTrue }
            styleFalse={ styleFalse }
            onClickAltenatives={ this.onClickAltenatives }
          />
          <p>{ timer }</p>
        </div>
      );
    }
}

const mapDispatchToProps = (dispatch) => ({
  triviaDispatch: (token) => dispatch(fetchTrivia(token)),
  addPlayerScore: (score, assertions) => dispatch(addScore(score, assertions)),
});

const mapStateToProps = (state) => ({
  triviaResults: state.trivia.results,
  triviaResponseCode: state.trivia.responseCode,
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);

Game.propTypes = {
  triviaDispatch: PropTypes.func.isRequired,
  triviaResponseCode: PropTypes.number.isRequired,
  triviaResults: PropTypes.objectOf.isRequired,
  addPlayerScore: PropTypes.func.isRequired,
};
