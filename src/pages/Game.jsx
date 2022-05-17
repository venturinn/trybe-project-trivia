import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import fetchTrivia from '../redux/actions/trivia';
import TriviaQuestions from '../components/TriviaQuestions';

let interval = '';
let timeout = '';

class Game extends React.Component {
    state = {
      redirectToLogin: false,
      questionIndex: 0,
      timer: 30,
      isDisabledAlternatives: false,
    }

    async componentDidMount() {
      const { triviaDispatch } = this.props;
      const token = JSON.parse(localStorage.getItem('token'));
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

    render() {
      const { redirectToLogin,
        questionIndex,
        timer,
        isDisabledAlternatives,
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
          />
          <p>{ timer }</p>
        </div>
      );
    }
}

const mapDispatchToProps = (dispatch) => ({
  triviaDispatch: (token) => dispatch(fetchTrivia(token)),
});

const mapStateToProps = (state) => ({
  triviaResults: state.trivia.results,
  triviaResponseCode: state.trivia.responseCode,
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);

Game.propTypes = {
  triviaDispatch: PropTypes.func.isRequired,
  triviaResponseCode: PropTypes.string.isRequired,
  triviaResults: PropTypes.objectOf.isRequired,
};
