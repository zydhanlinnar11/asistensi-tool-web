import React, { useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  name: string
  picture: string
}

interface UserContextInterface {
  user: User | null
  isUserFetched: boolean
  signOut: () => void
}

const UserContext = React.createContext<UserContextInterface>({
  user: null,
  isUserFetched: false,
  signOut: () => {},
})

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isUserFetched, setUserFetched] = useState(false)

  useEffect(() => {
    getUserFromToken().then((updatedUser: User | null) =>
      updateUser(updatedUser)
    )
  }, [])

  function updateUser(updatedUser: User | null) {
    if (!updatedUser) {
      localStorage.removeItem('token')
      setUser(null)
      setUserFetched(true)
      return
    }
    // Laravel return this value as integer
    // So we need to convert to boolean
    setUser(updatedUser)
    setUserFetched(true)
  }

  async function getUserFromToken() {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        return null
      }
      const json: User = (await response.json())['data']['user']

      return json
    } catch (error) {
      return null
    }
  }

  function signOut() {
    localStorage.removeItem('token')
    updateUser(null)
  }

  const value = {
    user,
    isUserFetched,
    signOut,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider

export function useUser() {
  return useContext(UserContext)
}
