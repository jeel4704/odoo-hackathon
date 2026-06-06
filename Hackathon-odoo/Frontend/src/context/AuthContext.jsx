import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vendorbridge_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = (payload) => {
    setUser(payload)
    localStorage.setItem('vendorbridge_user', JSON.stringify(payload))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vendorbridge_user')
    localStorage.removeItem('vendorbridge_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
