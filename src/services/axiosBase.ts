import axios from 'axios';


export default axios.create({
  // baseURL: 'http://192.168.29.7:5000/v1',
  headers: {
    'Accept': 'application/json;charset=UTF-8',
    'Authorization': ''
  }
});