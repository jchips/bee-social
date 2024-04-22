import React from 'react';
import './index.css';
import Dashboard from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/sass/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import UpdateLogin from './pages/UpdateLogin';
import Footer from './components/Footer/Footer';
import UpdateProfile from './pages/UpdateProfile/UpdateProfile';
import UserProfile from './pages/UserProfile/UserProfile';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={
            <PrivateRoute style={{ display: 'flex', flexDirection: 'column' }}>
              <Dashboard />
              <Footer />
            </PrivateRoute>
          } />

          <Route path='/update-login' element={
            <PrivateRoute>
              <UpdateLogin />
              <Footer />
            </PrivateRoute>
          } />

          <Route path='/update-profile' element={
            <PrivateRoute>
              <UpdateProfile />
              <Footer />
            </PrivateRoute>
          } />

          <Route path='/user-profile/:userId' element={
            <PrivateRoute>
              <UserProfile />
              <Footer />
            </PrivateRoute>
          } />

          <Route path='/signup' element={<Signup />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App;
