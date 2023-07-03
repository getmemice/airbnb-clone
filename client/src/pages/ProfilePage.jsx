import axios from "axios"
import { useContext, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import AccountNav from "../AccountNav"
import { UserContext } from "../UserContext"
import PlacesPage from "./PlacesPage.jsx"

export default function ProfilePage() {
  const { user, setUser, ready } = useContext(UserContext)
  let { subpage } = useParams()
  const [redirect, setRedirect] = useState(null)

  async function logout() {
    await axios.post("/logout")
    await setUser("")
    await setRedirect("/")
  }

  if (!ready) {
    return "Loading..."
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />
  }

  if (subpage === undefined) subpage = "profile"

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center justify-center mt-8 mx-auto">
          Logged in as {user.name} {user.email} <br />
          <button className="primary max-w-sm mt-2" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && (
        <div className="mt-8">
          <PlacesPage />
        </div>
      )}
    </div>
  )
}
