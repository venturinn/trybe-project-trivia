import React from 'react';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
    isBtnPlayDisabled: true,
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

  render() {
    const { isBtnPlayDisabled, name, email } = this.state;
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
        />
      </form>
    );
  }
}

export default Login;
