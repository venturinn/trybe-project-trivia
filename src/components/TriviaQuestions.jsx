import React from 'react';
import PropTypes from 'prop-types';

class TriviaQuestions extends React.Component {
  state = {
    styleTrue: {},
    styleFalse: {},
  }

  onClickAltenatives = () => {
    this.setState(
      { styleTrue: { border: '3px solid rgb(6, 240, 15)' },
        styleFalse: { border: '3px solid rgb(255, 0, 0)' } },
    );
  };

  shuffleAlternatives = (alternatives) => alternatives.sort(() => {
    const number = 0.5;
    return number - Math.random();
  });

  mountAlternatives = () => {
    const { question } = this.props;
    const { styleTrue, styleFalse } = this.state;

    const trueAlternative = question.correct_answer;
    const falseAlternatives = question.incorrect_answers;
    const falseAlternativesWithtag = falseAlternatives.map(
      (alternative) => ({ alternative, tag: false }),
    );
    const alternativesWithTag = [...falseAlternativesWithtag,
      { alternative: trueAlternative, tag: true }];
    const alternativesWithTagShuffle = this.shuffleAlternatives(alternativesWithTag);

    return (
      <div data-testid="answer-options">
        {alternativesWithTagShuffle.map((alternative, index) => {
          if (alternative.tag === true) {
            return (
              <button
                key={ index }
                type="button"
                id="0"
                style={ styleTrue }
                onClick={ this.onClickAltenatives }
                data-testid="correct-answer"
              >
                {alternative.alternative}
              </button>
            );
          }
          return (
            <button
              key={ index }
              style={ styleFalse }
              onClick={ this.onClickAltenatives }
              type="button"
              id={ index + 1 }
              data-testid={ `wrong-answer-${index}` }
            >
              {alternative.alternative}
            </button>
          );
        })}
      </div>
    );
  }

  render() {
    const { question } = this.props;

    return (
      <div>
        {question !== undefined && (
          <section>
            <p data-testid="question-category">{question.category}</p>
            <p data-testid="question-text">{question.question}</p>
            {this.mountAlternatives()}
          </section>
        )}
      </div>
    );
  }
}

export default TriviaQuestions;

TriviaQuestions.propTypes = {
  question: PropTypes.objectOf,
};

TriviaQuestions.defaultProps = {
  question: undefined,
};
