import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../jobItem'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
class Jobs extends Component {
  state = {
    profileDetails: '',
    jobsList: [],
    error: false,
    jobType: '',
    salary: 0,
    search: '',
    isLoading: false,
    jerror: false,
  }

  componentDidMount() {
    this.renderUserDetails()
  }

  renderUserDetails = async () => {
    this.setState({isLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const {history} = this.props
    if (jwtToken === undefined) {
      history.replace('/login')
    }
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const url = 'https://apis.ccbp.in/profile'

    const {jobType, salary, search} = this.state
    const jwt = Cookies.get('jwt_token')
    const options1 = {headers: {Authorization: `Bearer ${jwt}`}, method: 'GET'}
    const url1 = `https://apis.ccbp.in/jobs?employment_type=${jobType}&minimum_package=${salary}&search=${search}`
    const [response, response1] = await Promise.all([
      fetch(url, options),
      fetch(url1, options1),
    ])
    // const response = await fetch(url, options)
    // const profileData = await response.json()
    // const jwt = Cookies.get('jwt_token')

    // console.log(response)
    // console.log(response1)
    const profileData = await response.json()
    const data = await response1.json()

    if (response.ok === true) {
      const profileDetails = profileData.profile_details
      const updatedProfileData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({profileDetails: updatedProfileData, error: false})
    } else {
      this.setState({error: true})
    }

    if (response1.ok === true) {
      const updatedJobs = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({jobsList: updatedJobs, jerror: false, isLoading: false})
    } else {
      this.setState({jerror: true, isLoading: false})
    }
  }

  onCheck = event => {
    const jobCheck = event.target.value
    const {jobType} = this.state
    const isCheck = jobType.includes(jobCheck)
    if (isCheck) {
      this.setState(
        prevState => ({
          jobType: prevState.jobType.filter(each => each !== jobCheck),
        }),
        () => this.getJobsList(),
      )
    } else {
      this.setState(
        prevState => ({jobType: [...prevState.jobType, jobCheck]}),
        () => this.getJobsList(),
      )
    }
  }

  onSelect = event => {
    const sal = event.target.value
    this.setState({salary: sal}, () => this.getJobsList())
  }

  onSearch = event => {
    this.setState({search: event.target.value})
  }

  onSubmitSearch = () => {
    this.getJobsList()
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileDetails, error} = this.state
    return (
      <>
        <div>
          {error ? (
            <button type="button" onClick={this.renderUserDetails}>
              Retry
            </button>
          ) : (
            <>
              <img
                src={profileDetails.profileImageUrl}
                alt="profile"
                className=""
              />
              <h1>{profileDetails.name}</h1>
              <p>{profileDetails.shortBio}</p>
            </>
          )}
        </div>
        <hr />
        <h1>Type of Employment</h1>
        <ul className="employment">
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                value={each.employmentTypeId}
                id={each.employmentTypeId}
                onClick={this.onCheck}
                key={each.employmentTypeId}
              />
              <label htmlFor={each.employmentTypeId}>{each.label}</label>
            </li>
          ))}
        </ul>
        <hr />
        <h1>Salary Range</h1>
        <ul className="salary">
          {salaryRangesList.map(each => (
            <li key={each.salaryRangeId}>
              <input
                type="radio"
                name="salary"
                value={each.salaryRangeId}
                id={each.salaryRangeId}
                onChange={this.onSelect}
                key={each.salaryRangeId}
              />
              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  getJobsList = async () => {
    this.setState({isLoading: true})
    const {jobType, salary, search} = this.state
    const jwt = Cookies.get('jwt_token')
    const options = {headers: {Authorization: `Bearer ${jwt}`}, method: 'GET'}
    const url = `https://apis.ccbp.in/jobs?employment_type=${jobType}&minimum_package=${salary}&search=${search}`
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedJobs = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({jobsList: updatedJobs, error: false, isLoading: false})
    } else {
      this.setState({error: true})
    }
  }

  renderJobsListView = () => {
    const {jobsList, search, jerror} = this.state
    const isJobsList = jobsList.length
    if (isJobsList > 0 && !jerror) {
      return (
        <div>
          <input
            type="search"
            placeholder="search"
            value={search}
            onChange={this.onSearch}
          />
          <button
            type="button"
            onClick={this.onSubmitSearch}
            testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
          <ul className="job-unorder">
            {jobsList.map(each => (
              <JobItem key={each.id} jobs={each} />
            ))}
          </ul>
        </div>
      )
    }
    if (jerror) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className=""
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button type="button" onClick={this.getJobsList}>
            Retry
          </button>
        </div>
      )
    }
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
        <button type="button" onClick={this.getJobsList}>
          Retry
        </button>
      </div>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <>
        <Header />
        <div className="main-jobs">
          <div className="sub-containers">
            <div className="profile">{this.renderProfile()}</div>
            <div className="jobs">
              {isLoading ? this.renderLoader() : this.renderJobsListView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
