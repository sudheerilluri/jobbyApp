import {Link} from 'react-router-dom'
import './index.css'

const JonItem = props => {
  const {jobs} = props
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobs
  return (
    <li className="jobCard">
      <Link to={`/jobs/${id}`} className="link">
        <div className="logo-container">
          <img src={companyLogoUrl} alt="company logo" className="joblogo" />
          <div className="sub-logo">
            <h1>{title}</h1>
            <p>{rating}</p>
          </div>
        </div>
        <div className="location">
          <p>{location}</p>
          <p>{employmentType}</p>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JonItem
