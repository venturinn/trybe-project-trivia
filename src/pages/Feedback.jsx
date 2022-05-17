import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends React.Component {
  render() {
    const { assertions, score } = this.props;
    const minAssertions = 3;
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
