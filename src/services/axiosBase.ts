import axios from 'axios';


export default axios.create({
  baseURL: 'https://api.basickart.com/v1',
  headers: {
    'Accept': 'application/json;charset=UTF-8',
    'Authorization': ''
  }
});