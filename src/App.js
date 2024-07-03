import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import UpdateLogin from './pages/UpdateLogin';
import Settings from './pages/Settings/Settings';
import Footer from './components/Footer/Footer';
import UpdateProfile from './pages/UpdateProfile/UpdateProfile';
import UserProfile from './pages/UserProfile/[UserProfile]';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './assets/sass/App.scss';

const App = () => {
  const [showStackBtn, setShowStackBtn] = useState(false);
  const [postWidth, setPostWidth] = useState('17rem');
  const [postMargin, setPostMargin] = useState('0px 3px 10px 3px'); // 5px 3px
  const [rowConfig, setRowConfig] = useState('auto');

  // Sets the page view so that the posts are displayed in stacks
  const setStackedView = () => {
    setPostWidth('30rem');
    setRowConfig(1);
    setPostMargin('0px 10px 10px 10px'); // 5px auto
    setShowStackBtn(true);
  }

  // Sets the page view so that posts are displayed in a grid
  const setGridView = () => {
    setPostWidth('17rem');
    setRowConfig('auto');
    setPostMargin('0px 3px 10px 3px'); // 5px 3px
    setShowStackBtn(false);
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={
            <PrivateRoute>
              <Dashboard
                rowConfig={rowConfig}
                postWidth={postWidth}
                postMargin={postMargin}
                setGridView={setGridView}
                setStackedView={setStackedView}
                showStackBtn={showStackBtn}
              />
              <Footer />
            </PrivateRoute>
          } />

          <Route path='/update-login' element={
            <PrivateRoute>
              <UpdateLogin />
            </PrivateRoute>
          } />

          <Route path='/update-profile' element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          } />

          <Route path='/settings' element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />

          <Route path='/user-profile/:userId' element={
            <PrivateRoute>
              <UserProfile
                rowConfig={rowConfig}
                postWidth={postWidth}
                postMargin={postMargin}
                setStackedView={setStackedView}
                setGridView={setGridView}
                showStackBtn={showStackBtn}
              />
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
