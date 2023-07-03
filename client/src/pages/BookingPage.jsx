import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AddressLink from "../AddressLink"
import BookingDates from "../BookingDates"
import PlaceGallery from "../PlaceGallery"

export default function BookingPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id)
        if (foundBooking) {
          setBooking(foundBooking)
        }
      })
    }
  }, [id])

  if (!booking) {
    return ""
  }
  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-4 mb-4 rounded-2xl">
        <h2 className="text-xl">Your booking information</h2>
        <BookingDates booking={booking} />
      </div>
      <PlaceGallery place={booking.place} />
      <div className="my-4">
        <h2 className="font-semibold text-2xl">Description</h2>
        {booking.place.description}
      </div>
      <div className="bg-white -mx-8 px-8 py-4">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {booking.place.extraInfo}
        </div>
      </div>
    </div>
  )
}
