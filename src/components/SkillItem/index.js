import './index.css'

const SkillItem = props => {
  const {skillList} = props
  const {imageUrl, name} = skillList
  return (
    <li>
      <img src={imageUrl} alt={name} className="" />
      <p>{name}</p>
    </li>
  )
}

export default SkillItem
