import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import fetchTrivia from '../redux/actions/trivia';
import TriviaQuestions from '../components/TriviaQuestions';

class Game extends React.Component {
    state = {
      redirectToLogin: false,
      questionIndex: 0,
    }

    async componentDidMount() {
      const { triviaDispatch } = this.props;
      const token = JSON.parse(localStorage.getItem('token'));
      await triviaDispatch(token);
    }

  isTokenValid = (triviaResponseCode) => {
    const tokenExpireCode = 3;
    if (triviaResponseCode === tokenExpireCode) {
      localStorage.clear();
      this.setState({ redirectToLogin: true });
    }
  }

  render() {
    const { redirectToLogin, questionIndex } = this.state;
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
        />
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
