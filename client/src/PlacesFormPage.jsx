import axios from "axios"
import { Navigate, useParams } from "react-router-dom"
import Perks from "./Perks"
import PhotosUploader from "./PhotosUploader"
import { useEffect, useState } from "react"
import AccountNav from "./AccountNav"

export default function PlaceFormPage() {
  const [title, setTitle] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [perks, setPerks] = useState([])
  const [extraInfo, setExtraInfo] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [maxGuests, setMaxGuests] = useState(1)
  const [photos, setPhotos] = useState([])
  const [redirect, setRedirect] = useState(false)
  const [price, setPrice] = useState(100)
  const { id } = useParams()

  useEffect(() => {
    if (!id) return

    axios.get("/places/" + id).then((response) => {
      const { data } = response
      setTitle(data.title)
      setAddress(data.address)
      setPhotos(data.photos)
      setPerks(data.perks)
      setDescription(data.description)
      setExtraInfo(data.extraInfo)
      setCheckIn(data.checkIn)
      setCheckOut(data.checkOut)
      setMaxGuests(data.maxGuests)
      setPrice(data.price)
    })
  }, [id])

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    )
  }

  async function savePlace(e) {
    e.preventDefault()
    const placeData = {
      title,
      address,
      photos,
      perks,
      description,
      extraInfo,
      maxGuests,
      price,
      checkIn,
      checkOut,
    }

    if (id) {
      console.log("update enter")
      await axios.put("/places", {
        id,
        ...placeData,
      })
      setRedirect(true)
    } else {
      await axios.post("/places", {
        ...placeData,
      })
      setRedirect(true)
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={savePlace}>
          {preInput(
            "Title",
            "The title for your place should be short and catchy as in advertisement"
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title, for  example: My loverly apt"
          />
          {preInput("Address", "Address for this place")}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="address"
          />
          {preInput("Photos", "more = better")}
          <PhotosUploader addedPhotos={photos} setAddedPhotos={setPhotos} />
          {preInput("Description", "Description of the place")}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {preInput("Perks", "Select all the perks of your place")}
          <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks checkboxes={perks} setCheckboxes={setPerks} />
          </div>
          {preInput("Extra info", "house rules, etc")}
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          />
          {preInput(
            "Check in&out times, max guests",
            "add check in and out times, remember to have some time windows for cleaning the room between guests"
          )}
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2 -mb-2">Check in time</h3>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="15:00"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-2">Check out time</h3>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="10:00"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-2">Max number of guests</h3>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                placeholder="2"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-2">Price per night</h3>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2"
              />
            </div>
          </div>
          <div>
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
    </>
  )
}
