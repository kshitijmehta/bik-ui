import { Action, Dispatch } from 'redux';

import { User } from 'types';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';

/* Interface */
export interface UserInformationAction extends Action {
  readonly data?: User;
};


export interface UserInformation {
  readonly data?: User;
  readonly _isLoading: boolean;
  readonly _isError: boolean;
};


/* Initial State */
const initialState  = {
  data: {},
  _isError: false,
  _isLoading: false
} as UserInformation;


/* Actions*/

enum Actions {
  SET_USER = "SET_USER",
  LOADING_USER = "LOADING_USER",
  ERROR_USER = "ERROR_USER"
}

const setUser = (user: User) => ({
  type: Actions.SET_USER,
  data: user
});

const loadingUser = () => ({
  type: Actions.LOADING_USER
});

const errorUser = () => ({
  type: Actions.ERROR_USER
});


/* Reducer */

const userInformationReducer = (state = initialState, action: UserInformationAction): UserInformation => {
  switch (action.type) {
    case Actions.LOADING_USER:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
      };
    case Actions.SET_USER:
      return {
        ...state,
        data : action.data,
        _isError: false,
        _isLoading: false
      };
    case Actions.ERROR_USER:
      return{
        ...state,
        _isLoading: false,
        _isError: true
      };
    default:
      return state
  }
}

/* Thunk */

const getUser = () =>  async (disptach: Dispatch<UserInformationAction>) => {
  disptach(loadingUser());
  
  const response =  await api.get('/userinfo');

  if (response.status === HttpStatusCode.OK) {
    disptach(setUser(response.data.data as User));
  } else {
    disptach(errorUser());
  }
};

const saveUser = (data: User) =>  async (disptach: Dispatch<UserInformationAction>) => {
  disptach(loadingUser());
  
  const response =  await api.post('/userinfo', data);

  if (response.status === HttpStatusCode.OK) {
    disptach(setUser(data as User));
  } else {
    disptach(errorUser());
  }
};


export {
  userInformationReducer,
  getUser,
  saveUser
};
