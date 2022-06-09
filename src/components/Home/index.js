import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="main-container">
      <div className="sub-heading">
        <h1 className="sub-head">Find The Job That Fits Your Life</h1>
        <p>Millions of people are searching for jobs, salary</p>
        <Link to="/jobs">
          <button type="button">Find Jobs</button>
        </Link>
      </div>
    </div>
  </>
)

export default Home
