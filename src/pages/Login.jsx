import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import addPlayer from '../redux/actions/player';
import fetchToken from '../redux/actions/token';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
    isBtnPlayDisabled: true,
    redirectToGame: false,
    redirectToSettings: false,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, this.enableBtnPlay);
  };

  enableBtnPlay = () => {
    const { email, name } = this.state;

    if (name.length > 0 && email.length > 0) {
      this.setState({ isBtnPlayDisabled: false });
    } else {
      this.setState({ isBtnPlayDisabled: true });
    }
  };

  clickButtonPlay = async (event) => {
    event.preventDefault();
    const { addPlayerDispatch, tokenDispatch } = this.props;

    const { name, email } = this.state;
    addPlayerDispatch(name, email);

    tokenDispatch();

    this.setState({ redirectToGame: true });
  };

  clickButtonSettings = () => {
    this.setState({ redirectToSettings: true });
  }

  render() {
    const { isBtnPlayDisabled,
      name,
      email,
      redirectToGame,
      redirectToSettings } = this.state;

    if (redirectToGame) {
      return <Redirect to="/play" />;
    }

    if (redirectToSettings) {
      return <Redirect to="/settings" />;
    }

    return (
      <form>
        <label htmlFor="player-name">
          Name:
          <input
            data-testid="input-player-name"
            type="text"
            id="player-name"
            value={ name }
            name="name"
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="player-email">
          E-mail:
          <input
            data-testid="input-gravatar-email"
            type="email"
            id="player-email"
            value={ email }
            name="email"
            onChange={ this.handleChange }
          />
        </label>
        <input
          data-testid="btn-play"
          type="submit"
          value="Play"
          disabled={ isBtnPlayDisabled }
          onClick={ this.clickButtonPlay }
        />
        <input
          data-testid="btn-settings"
          type="submit"
          value="Settings"
          onClick={ this.clickButtonSettings }
        />
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  tokenDispatch: () => dispatch(fetchToken()),
  addPlayerDispatch: (name, email) => dispatch(addPlayer(name, email)),
});

export default connect(null, mapDispatchToProps)(Login);

Login.propTypes = {
  tokenDispatch: PropTypes.func.isRequired,
  addPlayerDispatch: PropTypes.func.isRequired,
};
