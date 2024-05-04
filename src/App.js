import React, { useState } from 'react';
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
import UserProfile from './pages/UserProfile/[UserProfile]';

const App = () => {
  const [postWidth, setPostWidth] = useState('17rem');
  const [postMargin, setPostMargin] = useState('0px 3px 10px 3px'); // 5px 3px
  const [rowConfig, setRowConfig] = useState('auto');

  // Sets the page view so that the posts are displayed in stacks
  const setStackedView = () => {
    setPostWidth('30rem');
    setRowConfig(1);
    setPostMargin('0px auto 10px auto'); // 5px auto
  }

  // Sets the page view so that posts are displayed in a grid
  const setGridView = () => {
    setPostWidth('17rem');
    setRowConfig('auto');
    setPostMargin('0px 3px 10px 3px'); // 5px 3px
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={
            <PrivateRoute style={{ display: 'flex', flexDirection: 'column' }}>
              <Dashboard rowConfig={rowConfig} postWidth={postWidth} postMargin={postMargin} setStackedView={setStackedView} setGridView={setGridView} />
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
              <UserProfile rowConfig={rowConfig} postWidth={postWidth} postMargin={postMargin} setStackedView={setStackedView} setGridView={setGridView} />
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
