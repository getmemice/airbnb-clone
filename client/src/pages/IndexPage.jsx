import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function IndexPage() {
  const [places, setPlaces] = useState([])
  useEffect(() => {
    axios
      .get("/all-places")
      .then((response) =>
        setPlaces([
          ...response.data,
          ...response.data,
          ...response.data,
          ...response.data,
        ])
      )
  })

  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place, index) => (
          <Link to={"/place/" + place._id} key={index}>
            <div className="bg-g500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={"http://66.42.40.163:4000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold truncate">{place.address}</h2>
            <h3 className="text-sm to-gray-500">{place.title}</h3>
            <span className="mt-1">
              <span className="font-bold">${place.price} per night</span>
            </span>
          </Link>
        ))}
    </div>
  )
}
