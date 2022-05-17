import React from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

class Ranking extends React.Component {
    state = {
      redirectToLogin: false,
      rankingOrderly: [],

    }

    componentDidMount() {
      const rankingStorage = JSON.parse(localStorage.getItem('ranking'));
      rankingStorage.sort((a, b) => {
        const oneNegative = -1;
        if (a.score < b.score) {
          return 1;
        }
        if (a.score > b.score) {
          return oneNegative;
        }
        return 0;
      });
      this.setState({ rankingOrderly: rankingStorage });
    }

    render() {
      const { redirectToLogin, rankingOrderly } = this.state;
      if (redirectToLogin) {
        return <Redirect to="/" />;
      }
      return (
        <div>
          <h1 data-testid="ranking-title">Ranking Page</h1>
          {rankingOrderly.map((player, index) => (
            <div key={ index }>
              <img src={ player.picture } alt="player perfil" />
              <p data-testid={ `player-name-${index}` }>{player.name}</p>
              <p data-testid={ `player-score-${index}` }>{player.score}</p>
            </div>
          ))}
          <button
            type="button"
            data-testid="btn-go-home"
            onClick={ () => { this.setState({ redirectToLogin: true }); } }
          >
            Play Again
          </button>
        </div>
      );
    }
}

export default Ranking;
