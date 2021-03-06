import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Header extends Component {
  onLogOut = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <div className="header">
        <ul className="header-list">
          <Link to="/" key="logo">
            <li>
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="logo"
              />
            </li>
          </Link>
          <Link to="/" key="home">
            <li>
              <button type="button">Home</button>
            </li>
          </Link>
          <Link to="/jobs" key="jobs">
            <li>
              <button type="button">Jobs</button>
            </li>
          </Link>
        </ul>
        <button type="button" onClick={this.onLogOut}>
          Logout
        </button>
      </div>
    )
  }
}

export default withRouter(Header)
