import { Route, Routes } from 'react-router-dom'
import './App.css'

import SignUp from './pages/auth/signUp'
import SignIn from './pages/auth/signIn'

import Home from './pages/start/home'
import Auth from './pages/start/auth'
import Select from './pages/start/select'

import Profile from './pages/home/profile'
import Dashboard from './pages/home/dashboard'

import Appointments from './pages/home/client/appointments'
import BookAppointment from './pages/home/client/book'
import UpdateAppointment from './pages/home/client/updateAppointment'

import ManageAvailability from './pages/home/profesional/availability'
import AppointmentRequest from './pages/home/profesional/appointmentRequest.jsx'
import Clients from './pages/home/profesional/clients.jsx'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path='/' element={<Auth />} />
      <Route path='/select' element={<Select />} />
      <Route path='/signUp' element={<SignUp />} />
      <Route path='/signIn' element={<SignIn />} />

      {/* PROTECTED HOME */}
      <Route
        path='/home'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      >
        {/* COMMON */}
        <Route index element={<Dashboard />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='profile' element={<Profile />} />

        {/* CLIENT */}
        <Route
          path='appointments'
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path='book'
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        {/* PROFESSIONAL */}
        <Route
          path='p_appointments'
          element={
            <ProtectedRoute allowedRoles={['professional']}>
              <AppointmentRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path='availability'
          element={
            <ProtectedRoute allowedRoles={['professional']}>
              <ManageAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path='clients'
          element={
            <ProtectedRoute allowedRoles={['professional']}>
              <Clients />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* CLIENT ONLY */}
      <Route
        path='/update-appointment/:id'
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <UpdateAppointment />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
