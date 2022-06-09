import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  fail: 'FAIL',
}
class JobItemDetailsView extends Component {
  state = {
    jobData: {},
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    this.setState({status: apiStatus.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwt = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {headers: {Authorization: `Bearer ${jwt}`}, method: 'GET'}
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateJobData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        skills: data.job_details.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        similarJobs: data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      // console.log(updateJobData)

      this.setState({
        jobData: updateJobData,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.fail})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFail = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className=""
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
    </div>
  )

  renderView = () => {
    const {jobData} = this.state
    console.log(jobData.similar)
    return (
      <div className="job-detail">
        <div className="job-sub">
          <ul className="skills">
            <li>
              <img
                src={jobData.companyLogoUrl}
                alt="job details company logo"
                className=""
              />
              <p>{jobData.similarJobs[0].title}</p>
              <p>{jobData.rating}</p>
            </li>
            <li className="job-location">
              <p>{jobData.location}</p>
              <p>{jobData.employmentType}</p>
              <p>{jobData.packagePerAnnum}</p>
            </li>
          </ul>
          <hr />
          <h1>Description</h1>
          <a href={jobData.companyWebsiteUrl}>Visit</a>
          <p>{jobData.jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skill">
            {jobData.skills.map(each => (
              <li key={each.name}>
                <img src={each.imageUrl} alt={each.name} className="" />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="life-at">
            <p>{jobData.lifeAtCompany.description}</p>
            <img
              src={jobData.lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-img"
            />
          </div>
        </div>
        <h1 className="similar-heading">Similar Jobs</h1>
        <div className="sub-2">
          <ul className="similar">
            {jobData.similarJobs.map(each => (
              <li key={each.id} className="similar-list">
                <div>
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                    className="similar-img"
                  />
                  <div>
                    <h1>{each.title}</h1>
                    <p>{each.rating}</p>
                  </div>
                </div>
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
                <div className="similar-location">
                  <p>{each.location}</p>
                  <p>{each.employmentType}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  getView = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.progress:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderView()
      case apiStatus.fail:
        return this.renderFail()
      default:
        return null
    }
  }

  render() {
    // console.log(skills)
    return (
      <>
        <Header />
        {this.getView()}
      </>
    )
  }
}

export default JobItemDetailsView
