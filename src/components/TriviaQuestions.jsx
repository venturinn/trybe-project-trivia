import React from 'react';
import PropTypes from 'prop-types';

class TriviaQuestions extends React.Component {
  shuffleAlternatives = (alternatives) => alternatives.sort(() => {
    const number = 0.5;
    return number - Math.random();
  });

  randomAlternatives = () => {
    const { question } = this.props;

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
                data-testid="correct-answer"
              >
                {alternative.alternative}
              </button>
            );
          }
          return (
            <button
              key={ index }
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
            {this.randomAlternatives()}
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
