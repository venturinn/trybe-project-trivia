import React from 'react';
import Header from '../components/Header';

class Feedback extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <h1 data-testid="feedback-text">Feedback Page</h1>
      </div>
    );
  }
}

export default Feedback;
