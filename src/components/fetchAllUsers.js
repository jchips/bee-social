// import React, { useState, useEffect } from 'react';
import axios from 'axios';

export async function users() {
  let requestURL = `${process.env.REACT_APP_SERVER}/users`;
  // return axios.get(requestURL)
  //   .then(response => {
  //     return response;
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     return err;
  //   })
  try {
    let response = await axios.get(requestURL)
    return response.data;
  } catch (err) {
    console.error(err);
    return 'Failed to fetch users';
  }
}

// const FetchAllUsers = () => {
//   const [users, setUsers] = useState([]);

  

//   useEffect(() => {
//    fetchAllUsers();
//   }, []);

//   return users;
// }

// export default FetchAllUsers;
