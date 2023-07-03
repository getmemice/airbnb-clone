import PropTypes from "prop-types"

PlaceImg.propTypes = {
  place: PropTypes.object,
  index: PropTypes.number,
  className: PropTypes.string,
}

export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) return
  if (className) {
    className = "object-cover w-full"
  }
  return (
    <img
      className="object-cover aspect-square h-full"
      src={"http://66.42.40.163:4000/uploads/" + place.photos[index]}
      alt=""
    />
  )
}
