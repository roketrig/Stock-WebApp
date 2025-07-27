import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (username, password) => {
    if (username === 'admin' && password === '1234') {
      setUser({ username })
      return true
    }
        if (username === 'tugkan' && password === '1234') {
      setUser({ username })
      return true
    }
        if (username === 'serkan' && password === '1234') {
      setUser({ username })
      return true
    }
        if (username === 'ata' && password === '1234') {
      setUser({ username })
      return true
    }
        if (username === 'leyla' && password === '1234') {
      setUser({ username })
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
