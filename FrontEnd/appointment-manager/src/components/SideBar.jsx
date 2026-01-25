import { Link } from 'react-router-dom'
import '../styles/sidebar.css'
import { useEffect, useState } from "react"
import { jwtDecode } from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Sidebar() {
  const [user, setUser] = useState({})
  const [pages, setPages] = useState([])

  const token = localStorage.getItem('token')
  let userId = null
  let role = null

  if (token) {
    const decoded = jwtDecode(token)
    userId = decoded.userId
    role = decoded.role
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`
  }

  const getUser = async () => {
    try {
      const result = await fetch(
        `${API_URL}/user?userId=${userId}`,
        { headers: authHeaders }
      )

      if (result.ok) {
        const data = await result.json()
        setUser(data)
      } else {
        console.error('Error to Get user', result.statusText)
      }
    } catch (error) {
      console.error('Error', error.message)
    }
  }

  const getPages = async () => {
    try {
      const result = await fetch(
        `${API_URL}/pages?role=${role}`,
        { headers: authHeaders }
      )

      if (result.ok) {
        const data = await result.json()
        setPages(data)
      } else {
        console.error('Error to Get pages', result.statusText)
      }
    } catch (error) {
      console.error('Error', error.message)
    }
  }

  useEffect(() => {
    if (userId && role && token) {
      getUser()
      getPages()
    }
  }, [userId, role])

  return (
    <div className="shadow sidebar">
      <Link className="profile-link" to="profile">
        <img
          className="imgPerfil img-fluid rounded-circle"
          src={
            user.avatar
              ? `${API_URL}/uploads/avatars/${user.avatar}`
              : `${API_URL}/uploads/avatars/default.png`
          }
          alt="user image"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = `${API_URL}/uploads/avatars/default.png`
          }}
        />
        <p className="flex m-0">{user.name}</p>
      </Link>

      {pages.map((page) => (
        <Link key={page.path} className="sidebar-link" to={page.path}>
          {page.name}
        </Link>
      ))}
    </div>
  )
}