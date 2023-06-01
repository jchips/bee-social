import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/sass/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import VerifyEmail from './components/VerifyEmail';
import ForgotPassword from './components/ForgotPassword';
import UpdateLogin from './components/UpdateLogin';
import Footer from './components/Footer/Footer';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Routing = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={
            <PrivateRoute>
              <App/>
              <Footer/>
            </PrivateRoute>
          }/>

          <Route path='/update-login' element={
            <PrivateRoute>
              <UpdateLogin/>
              <Footer/>         
            </PrivateRoute>
          } />

          <Route path='/update-profile' element={
            <PrivateRoute>
              <UpdateProfile/>
              <Footer/>
            </PrivateRoute>
          } />

          <Route path='/signup' element={<Signup/>} />
          <Route path='/verify-email' element={<VerifyEmail/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);
