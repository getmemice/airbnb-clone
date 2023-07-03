import { Route, Routes } from "react-router-dom"
import Header from "./Header"
import Layout from "./Layout"
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import axios from "axios"
import { UserContextProvider } from "./UserContext"
import { useEffect, useState } from "react"
import ProfilePage from "./pages/ProfilePage"
import PlacesPage from "./pages/PlacesPage"
import PlaceFormPage from "./PlacesFormPage"
import PlacePage from "./pages/PlacePage"
import BookingsPage from "./pages/BookingsPage"
import BookingPage from "./pages/BookingPage"

axios.defaults.baseURL = "http://66.42.40.163:4000"
axios.defaults.withCredentials = true

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) {
      axios.get("/profile")
    }
  }, [user])

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="account" element={<ProfilePage />} />
          <Route path="account" element={<ProfilePage />} />
          <Route path="account/places" element={<PlacesPage />} />
          <Route path="account/places/new" element={<PlaceFormPage />} />
          <Route path="account/places/:id" element={<PlaceFormPage />} />
          <Route path="place/:id" element={<PlacePage />} />
          <Route path="account/bookings" element={<BookingsPage />} />
          <Route path="account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
