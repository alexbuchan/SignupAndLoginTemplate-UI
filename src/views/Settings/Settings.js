import React from 'react';
import Form from '../../components/Form/Form';
import TextField from '../../components/TextField/TextField';
import Actions from '../../actions/settings/SettingsActions';
import UserStore from '../../stores/UserStore/UserStore';
import FlashMessage from '../../components/FlashMessage/FlashMessage';

class Settings extends React.Component {
  constructor() {
    super();

    this.initialState = {
      username: UserStore.getUser().username,
      email: UserStore.getUser().email,
      edit: false,
      disableSubmitButton: true
    }

    this.state = this.initialState;
    this.submitted = false;
  }

  _onChange = () => {
    if (UserStore.getUser()) {
      this.setState({
        username: UserStore.getUser().username,
        email: UserStore.getUser().email
      });

      this.initialState = this.state;
    }
  }

  componentDidMount() {
    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  handleEditClick = (ev) => {
    this.setState({
      edit: true,
      disableSubmitButton: false
    });
  }

  renderEditClick = () => {
    if (!this.state.edit) {
      return <button data-test='edit-button' className="edit-form-button" onClick={ this.handleEditClick }>Edit</button>;
    }

    return null;
  }

  handleCancelEditClick = (ev) => {
    this.setState(this.initialState);
  }

  renderCancelEditClick = () => {
    if (this.state.edit) {
      return <button data-test='cancel-edit-button' className="cancel-edit-form-button" onClick={ this.handleCancelEditClick }>X</button>;
    }

    return null;
  }

  handleOnChange = (ev) => {
    ev.preventDefault();

    this.setState({
      [ev.target.name]: ev.target.value
    });
  }

  handleOnSubmit = () => {
    const fields = { username: this.state.username, email: this.state.email };
    Actions.updateUserSettings(fields);
    this.setState(this.initialState);
  }

  render() {
    const fields = { username: this.state.username, email: this.state.email };

    return (
      <div className="settings-view">
        <h1 className="settings-header">Settings</h1>

        <div className="settings">
          <div className="user-signup">
            <div className="user-details">
              <h4 className="user-details-title">User Details</h4>
              { this.renderEditClick() }
              { this.renderCancelEditClick() }

            </div>

            <Form
              disableSubmitButton={ this.state.disableSubmitButton }
              validate={ true }
              fields={ fields }
              areRequired={ ['username', 'email'] }
              onSubmit={ this.handleOnSubmit }
            >
              <TextField
                label='Username'
                name='username'
                type='text'
                value={ this.state.username }
                disabled={ !this.state.edit }
                onChange={ this.handleOnChange }
                isRequired={ true }
              />

              <TextField
                label='Email'
                name='email'
                type='text'
                value={ this.state.email }
                onChange={ this.handleOnChange }
                disabled={ !this.state.edit }
                isRequired={ true }
              />
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;