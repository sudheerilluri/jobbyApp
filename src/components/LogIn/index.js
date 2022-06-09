import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LogIn extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  onLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const fields = {username, password}
    const options = {method: 'POST', body: JSON.stringify(fields)}
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok === true) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30, path: '/'})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({isError: true, errorMsg: data.error_msg})
    }
  }

  onChangeUser = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, isError, errorMsg} = this.state
    const jwt = Cookies.get('jwt_token')
    if (jwt !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className=""
          />
          <form onSubmit={this.onLogin}>
            <label htmlFor="user">UserName</label>
            <input
              type="text"
              id="user"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUser}
            />
            <label htmlFor="pass">Password</label>
            <input
              type="password"
              id="pass"
              placeholder=""
              value={password}
              onChange={this.onChangePassword}
            />
            <button type="submit">LogIn</button>
            {isError && <p>*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LogIn
