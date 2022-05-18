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
      redirectToFeedback: false,
      questionIndex: 0,
      timer: 30,
      isDisabledAlternatives: false,
      isVisibleButtonNext: false,
      styleTrue: {},
      styleFalse: {},
      score: 0,
      assertions: 0,
    }

    async componentDidMount() {
      const { triviaDispatch } = this.props;
      const token = localStorage.getItem('token');
      await triviaDispatch(token);
      this.isTokenValid();
      this.startTime();
    }

    startTime = () => {
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
      this.setState({ isDisabledAlternatives: true, isVisibleButtonNext: true });
      clearInterval(interval);
      clearTimeout(timeout);
    };

    isTokenValid = () => {
      const { triviaResponseCode } = this.props;
      const tokenExpireCode = 3;
      if (triviaResponseCode === tokenExpireCode) {
        localStorage.clear();
        this.setState({ redirectToLogin: true });
      }
    }

    onClickAltenatives = ({ target }) => {
      this.endTime();
      const { questionIndex, timer } = this.state;
      this.setState(
        { styleTrue: { border: '3px solid rgb(6, 240, 15)' },
          styleFalse: { border: '3px solid rgb(255, 0, 0)' },
          isVisibleButtonNext: true,
          isDisabledAlternatives: true,
        },
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

    clickNext = () => {
      this.endTime();

      const { questionIndex } = this.state;
      const maxQuestionsIndex = 4;

      if (questionIndex === maxQuestionsIndex) {
        const { name, picture, score } = this.props;
        const newRankingElement = { name, picture, score };
        const ranking = JSON.parse(localStorage.getItem('ranking'));
        if (ranking === null) {
          localStorage.setItem('ranking', JSON.stringify([newRankingElement]));
        } else {
          ranking.push(newRankingElement);
          localStorage.setItem('ranking', JSON.stringify(ranking));
        }
        this.setState({ redirectToFeedback: true });
      }

      this.setState((previous) => ({
        questionIndex: previous.questionIndex + 1,
        timer: 30,
        isVisibleButtonNext: false,
        styleTrue: {},
        styleFalse: {},
      }));

      this.startTime();
    }

    render() {
      const {
        redirectToLogin,
        redirectToFeedback,
        questionIndex,
        timer,
        isDisabledAlternatives,
        styleTrue,
        styleFalse,
        isVisibleButtonNext,
      } = this.state;
      const { triviaResults } = this.props;

      if (redirectToLogin) {
        return <Redirect to="/" />;
      }

      if (redirectToFeedback) {
        return <Redirect to="/feedback" />;
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
          {isVisibleButtonNext && (
            <button onClick={ this.clickNext } data-testid="btn-next" type="button">
              Next
            </button>
          )}
          <p data-testid="timer">{ timer }</p>
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
  name: state.player.name,
  picture: state.player.gravatarUrl,
  score: state.player.score,
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);

Game.propTypes = {
  triviaDispatch: PropTypes.func.isRequired,
  triviaResponseCode: PropTypes.number.isRequired,
  triviaResults: PropTypes.objectOf.isRequired,
  addPlayerScore: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};
