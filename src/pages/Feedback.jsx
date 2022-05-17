import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../components/Header';

class Feedback extends React.Component {
    state = {
      redirectToLogin: false,
    }

    render() {
      const { assertions, score } = this.props;
      const { redirectToLogin } = this.state;
      const minAssertions = 3;

      if (redirectToLogin) {
        return <Redirect to="/" />;
      }

      return (
        <div>
          <Header />
          {(assertions < minAssertions)
            ? <p data-testid="feedback-text">Could be better...</p>
            : <p data-testid="feedback-text">Well Done!</p>}
          <p>Total Hits</p>
          <p data-testid="feedback-total-question">
            {assertions}
          </p>
          <p>Total Score:</p>
          <p data-testid="feedback-total-score">
            {score}
          </p>
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ () => { this.setState({ redirectToLogin: true }); } }
          >
            Play Again
          </button>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

export default connect(mapStateToProps)(Feedback);

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};
