import './index.css'

const SimilarItems = props => {
  const {similar} = props
  const {
    companyLogoUrl,
    title,
    rating,
    jobDescription,
    location,
    employmentType,
  } = similar
  return (
    <li className="similar-list">
      <div>
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-img"
        />
        <div>
          <h1>{title}</h1>
          <p>{rating}</p>
        </div>
      </div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <div className="similar-location">
        <p>{location}</p>
        <p>{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarItems
