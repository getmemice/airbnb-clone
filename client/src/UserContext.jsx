import { createContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then((response) => setUser(response.data))

      setReady(true)
    }
  }, [])

  return (
    <UserContext.Provider value={{ ready, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
