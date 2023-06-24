import axios from 'axios';

export function fetchAllUsers() {
  let requestURL = `${process.env.REACT_APP_SERVER}/users`;
  return axios.get(requestURL)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.error(err);
      return null;
    })
}