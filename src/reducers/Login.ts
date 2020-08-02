import { Action, Dispatch } from "redux";
import { Login } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

interface UserLoginRegisterAction extends Action {
  data?: string;
}

interface UserLoginResponse {
  message: string;
  access_token?: string;
};

export interface UserLoginRegister {
  _isLoading: boolean;
  _isError: boolean;
  _isSuccess: boolean;
  message?: string;
}

const initialState = {
  _isLoading : false,
  _isError: false,
  _isSuccess: false,
  message: ''
} as UserLoginRegister;

enum Actions {
  LOADING_LOGIN = 'LOADING_LOGIN',
  ERROR_LOGIN = 'ERROR_LOGIN',
  SUCCESS_LOGIN = 'SUCCESS_LOGIN',
  LOADING_REGISTER = 'LOADING_REGISTER',
  ERROR_REGISTER = 'ERROR_REGISTER',
  SUCCESS_REGISTER = 'SUCCESS_REGISTER',
  DEFAULT_STATE = 'DEFAULT_STATE'
};

const loadingLogin = () => ({
  type : Actions.LOADING_LOGIN
});

const errorLogin = (message: string) => ({
  type : Actions.ERROR_LOGIN,
  data: message
});

const successLogin = () => ({
  type : Actions.SUCCESS_LOGIN
});

const loadingRegister = () => ({
  type : Actions.LOADING_REGISTER
});

const errorRegister = (message: string) => ({
  type : Actions.ERROR_REGISTER,
  data: message
});

const successRegister = (message: string) => ({
  type : Actions.SUCCESS_REGISTER,
  data: message
});

const defaultLoginRegister = () => ({
  type: Actions.DEFAULT_STATE
})


const userLoginReducer = (state = initialState, action: UserLoginRegisterAction): UserLoginRegister  => {
  
  switch (action.type) {
    case Actions.LOADING_LOGIN:
    case Actions.LOADING_REGISTER:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      };
    case Actions.ERROR_LOGIN:
    case Actions.ERROR_REGISTER:
      return {
        ...state,
        _isLoading: false,
        _isError: true,
        _isSuccess: false,
        message: action.data
      };
    case Actions.SUCCESS_LOGIN:
    case Actions.SUCCESS_REGISTER:
      return {
        ...state,
        _isLoading: false,
        _isError: false,
        _isSuccess: true,
        message: action.data
      };
    case Actions.DEFAULT_STATE:
      return {
        ...state,
        _isLoading: false,
        _isError: false,
        _isSuccess: false
      }
    default:
      return state;
  }
}


const userLogin = (loginData: Login) =>  async (dispatch: Dispatch<Action>) => {
  
  dispatch(loadingLogin());
  const response =  await api.post('/login', loginData);

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as UserLoginResponse;
    window.localStorage.setItem('biktoken', res.access_token || '');
    dispatch(successLogin());
  } else{
    const res = response as UserLoginResponse;
    dispatch(errorLogin(res.message));
  }
};

const userRegister = (registerationData: Login) => async (dispatch: Dispatch<Action>) => {
  dispatch(loadingRegister());
  const response = await api.post('/registration', registerationData);

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as UserLoginResponse;
    dispatch(successRegister(res.message));
  } else{
    const res = response as UserLoginResponse;
    dispatch(errorRegister(res.message));
  }
}


export {
  userLogin,
  userLoginReducer,
  loadingLogin,
  loadingRegister,
  errorLogin,
  errorRegister,
  successLogin,
  successRegister,
  defaultLoginRegister,
  userRegister
}