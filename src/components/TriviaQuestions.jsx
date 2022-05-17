import React from 'react';
import PropTypes from 'prop-types';

class TriviaQuestions extends React.Component {
  shuffleAlternatives = (alternatives) => alternatives.sort(() => {
    const number = 0.5;
    return number - Math.random();
  });

  mountAlternatives = () => {
    const { question,
      isDisabledAlternatives,
      onClickAltenatives,
      styleFalse,
      styleTrue } = this.props;

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
                name="correct"
                style={ styleTrue }
                onClick={ onClickAltenatives }
                data-testid="correct-answer"
                disabled={ isDisabledAlternatives }
              >
                {alternative.alternative}
              </button>
            );
          }
          return (
            <button
              key={ index }
              style={ styleFalse }
              onClick={ onClickAltenatives }
              type="button"
              name="wrong"
              data-testid={ `wrong-answer-${index}` }
              disabled={ isDisabledAlternatives }
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
  isDisabledAlternatives: PropTypes.bool.isRequired,
  onClickAltenatives: PropTypes.func.isRequired,
  styleFalse: PropTypes.objectOf.isRequired,
  styleTrue: PropTypes.objectOf.isRequired,
};

TriviaQuestions.defaultProps = {
  question: undefined,
};
