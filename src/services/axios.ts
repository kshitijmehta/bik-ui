import{ AxiosRequestConfig } from 'axios';

import { HttpRequest } from 'appConstants';
import axios from './axiosBase';

const setAuthToken = (): void => {
  axios.defaults.headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('biktoken');
};

const api = {
  get: (url: string) => {
    return makeRequest({
      method: HttpRequest.GET,
      url
    })
  },

  post: (url: string, data: object) => {
    return makeRequest({
      method: HttpRequest.POST,
      url,
      data
    })
  }
};

const makeRequest = async (config: AxiosRequestConfig) => {
  try {
    setAuthToken();
    const response = await axios.request(config);
    return response;
  } catch (error) {
    if(error.response.status === 401 || error.response.status === 422 || error.response.status === 404){
      window.localStorage.removeItem('biktoken')
      window.location.href = '/login';
      return {
        message: error.response.data.message || 'Auth expired',
        data: {}
      }
    }else {
      return {
        message: error.response.data.message || 'Default Api error',
        status: error.response.status || 400,
        data: {}
      }
    }
  };
};


export { api, setAuthToken };