import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';

class Header extends React.Component {
  state = {
    gravatarUrlImage: '',
  };

  componentDidMount() {
    const { playerEmail } = this.props;
    const gravatarHash = md5(playerEmail).toString();
    this.setState({
      gravatarUrlImage: `https://www.gravatar.com/avatar/${gravatarHash}`,
    });
  }

  render() {
    const { playerName, playerScore } = this.props;
    const { gravatarUrlImage } = this.state;

    return (
      <div>
        <img
          data-testid="header-profile-picture"
          src={ gravatarUrlImage }
          alt="user perfil"
        />
        <p data-testid="header-player-name">
          {`Player: ${playerName}`}
        </p>
        <p data-testid="header-score">
          { playerScore }
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playerName: state.player.name,
  playerEmail: state.player.gravatarEmail,
  playerScore: state.player.score,
});

export default connect(mapStateToProps)(Header);

Header.propTypes = {
  playerName: PropTypes.string.isRequired,
  playerEmail: PropTypes.string.isRequired,
  playerScore: PropTypes.number.isRequired,
};
