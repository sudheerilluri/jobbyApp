import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import SkillItem from '../SkillItem'
import SimilarItems from '../SimilarJobs'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  fail: 'FAIL',
}

class JobItemDetails extends Component {
  state = {
    jobData: [],
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
    const data = await response.json()
    if (response.ok === true) {
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

  onLoadJobs = () => {
    this.getJobData()
  }

  renderFail = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className=""
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onLoadJobs}>
        Retry
      </button>
    </div>
  )

  renderView = () => {
    const {jobData} = this.state
    const {skills, similarJobs} = jobData

    return (
      <>
        <div className="job-detail">
          <div className="skills">
            <div>
              <img
                src={jobData.companyLogoUrl}
                alt="job details company logo"
                className=""
              />
              <h1>{similarJobs[0].title}</h1>
              <p>{jobData.rating}</p>
            </div>
            <div className="job-location">
              <p>{jobData.location}</p>
              <p>{jobData.employmentType}</p>
              <p>{jobData.packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <h1>Description</h1>
          <button type="button">
            <a
              href={jobData.companyWebsiteUrl}
              rel="noreferrer"
              target="_blank"
            >
              Visit
            </a>
          </button>
          <p>{jobData.jobDescription}</p>
          <h1>Skills</h1>
          <div className="">
            <ul className="skill">
              {skills.map(each => (
                <SkillItem key={skills.indexOf(each)} skillList={each} />
              ))}
            </ul>
          </div>
          <h1>Life at Company</h1>
          <div className="life-at">
            <p>{jobData.lifeAtCompany.description}</p>
            <img
              src={jobData.lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-img"
            />
          </div>

          <h1 className="similar-heading">Similar Jobs</h1>
          <div className="">
            <ul className="sub-2 similar">
              {similarJobs.map(each => (
                <SimilarItems key={each.id} similar={each} />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  getView = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderView()
      case apiStatus.progress:
        return this.renderLoader()
      case apiStatus.fail:
        return this.renderFail()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.getView()}
      </>
    )
  }
}

export default JobItemDetails
