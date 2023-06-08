// import React, { useState, useEffect } from 'react';
import axios from 'axios';

export async function getUser() {
  let requestURL = `${process.env.REACT_APP_SERVER}/users`;
  try {
    let response = await axios.get(requestURL)
    return response.data;
  } catch (err) {
    console.error(err);
    return 'Failed to fetch users';
  }

  // let requestURL = `${process.env.REACT_APP_SERVER}/users/${userId}`;
  // axios.get(requestURL)
  //   .then(response => {
  //     // console.log(response.data);
  //     return response.data;
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     return 'Could not load user';
  //   });
}
