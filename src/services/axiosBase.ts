import axios from 'axios';


export default axios.create({
  baseURL: 'v1',
  headers: {
    'Accept': 'application/json;charset=UTF-8',
    'Authorization': ''
  }
});