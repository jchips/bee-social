// import React, { useState, useEffect } from 'react';
import axios from 'axios';

// export async function getUser() {
//   let requestURL = `${process.env.REACT_APP_SERVER}/users`;
//   try {
//     let response = await axios.get(requestURL)
//     return response.data;
//   } catch (err) {
//     console.error(err);
//     return 'Failed to fetch users';
//   }

export function fetchAllUsers() {
  let requestURL = `${process.env.REACT_APP_SERVER}/users`;
  return axios.get(requestURL)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.error(err);
      // return 'Could not fetch users';
      return null;
    })
}