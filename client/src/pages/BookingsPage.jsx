import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AccountNav from "../AccountNav"
import BookingDates from "../BookingDates"
import PlaceImg from "../PlaceImg"

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data)
    })
  }, [])

  return (
    <div>
      <div>
        <AccountNav />
      </div>
      <div className="mt-8">
        {bookings?.length > 0 &&
          bookings.map((booking, index) => (
            <Link
              to={"/account/bookings/" + booking._id}
              className="mb-1 flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
              key={index}
            >
              <div className="w-48 shrink-0">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 pr-3 flex flex-col justify-center">
                <h2 className="text-xl text-left ">{booking.place.title}</h2>
                <BookingDates booking={booking} />
                <div className="flex items-center gap-1 text-xl font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <div>Total price: ${booking.price}</div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}
