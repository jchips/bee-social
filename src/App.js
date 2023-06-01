import React from 'react';
// import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home';

const App = () => {
  return (
    <div className='dashboard text-center row'>
      <Sidebar />
      <Home/>
    </div>
  )
}

export default App;
