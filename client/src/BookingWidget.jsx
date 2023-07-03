import axios from "axios"
import PropTypes from "prop-types"
import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns"
import { Navigate } from "react-router-dom"
import { UserContext } from "./UserContext"

BookingWidget.propTypes = {
  place: PropTypes.object,
}

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [numberOfGuest, setNumberOfGuest] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [redirect, setRedirect] = useState("")
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
  }, [user])

  let numberOfNights = 0
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    )
  }

  async function bookThisPlace() {
    const { data } = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuest,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    })
    const bookingId = data._id
    setRedirect(`/account/bookings/${bookingId}`)
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price: ${place.price} per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4 ">
              <label>Check in:</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="py-3 px-4 border-l">
              <label>Check out:</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label>Number of guests</label>
            <input
              type="number"
              value={numberOfGuest}
              onChange={(e) => setNumberOfGuest(e.target.value)}
            />
          </div>
          {numberOfNights > 0 && (
            <div className="py-3 px-4 border-t">
              <label>your full name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>your phone number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
        </div>

        <button onClick={bookThisPlace} className="primary mt-4">
          Book this places
          {numberOfNights > 0 && <span>{numberOfNights * place.price}</span>}
        </button>
      </div>
    </div>
  )
}
