import { Action, Dispatch } from 'redux';

import { User } from 'types';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';

/* Interface */
export interface UserInformationAction extends Action {
  readonly data?: User;
  readonly allUsers?: User[];
  readonly message?: string;
};


export interface UserInformation {
  readonly data?: User;
  readonly allUsers?: User[];
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
};


/* Initial State */
const initialState  = {
  data: {
    isAdmin: false,
  },
  allUsers :[],
  _isError: false,
  _isLoading: false,
  _isSuccess: false,
  message: ''
} as UserInformation;


/* Actions*/

enum Actions {
  SET_USER = "SET_USER",
  LOADING_USER = "LOADING_USER",
  ERROR_USER = "ERROR_USER",
  SET_ALL_USER = 'SET_ALL_USER',
  UPDATE_USER_DISCOUNT = 'UPDATE_USER_DISCOUNT',
  DEFAULT_USER = 'DEFAULT_USER'
}

const setUser = (user: User) => ({
  type: Actions.SET_USER,
  data: user
});

const setAllUser = (user: User[]) => ({
  type: Actions.SET_ALL_USER,
  allUsers: user
});

const loadingUser = () => ({
  type: Actions.LOADING_USER
});

const defaultUser = () => ({
  type: Actions.DEFAULT_USER
});

const errorUser = (message: string) => ({
  type: Actions.ERROR_USER,
  message
});

const updateDiscount = (emailAddress:string, discount: string, message: string) => ({
  type: Actions.UPDATE_USER_DISCOUNT,
  data: {emailAddress, discount},
  message
});


/* Reducer */

const userInformationReducer = (state = initialState, action: UserInformationAction): UserInformation => {
  switch (action.type) {
    case Actions.LOADING_USER:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      };
    case Actions.SET_USER:
      return {
        ...state,
        data : action.data,
        _isError: false,
        _isLoading: false,
        _isSuccess: true,
        message: action.message
      };
    case Actions.DEFAULT_USER:
      return {
        ...state,
        ...initialState
      };
    case Actions.SET_ALL_USER:
      return {
        ...state,
        allUsers : action.allUsers,
        _isError: false,
        _isLoading: false,
        _isSuccess: true,
        message: action.message
      };
    case Actions.UPDATE_USER_DISCOUNT:
      return {
        ...state,
        _isError: false,
        _isLoading: false,
        _isSuccess: true,
        message: action.message,
        allUsers : state.allUsers?.map((user) => {
          if(user.emailAddress?.toLowerCase() === action.data?.emailAddress){
            return {...user, discount:action.data?.discount}
          }
          return user
        }),
      };
    case Actions.ERROR_USER:
      return{
        ...state,
        _isLoading: false,
        _isError: true,
        _isSuccess: true,
        message: action.message
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
    disptach(errorUser('Some error occured, try again.'));
  }
};

const saveUser = (data: User) =>  async (disptach: Dispatch<UserInformationAction>) => {
  disptach(loadingUser());
  
  const response =  await api.post('/userinfo', data);

  if (response.status === HttpStatusCode.OK) {
    const res = response.data.data as User;
    disptach(setUser({
      ...data,
      addressId : res
    } as User));
  } else {
    disptach(errorUser('Some error occured, try again.'));
  }
};

const getAllUser = () =>  async (disptach: Dispatch<UserInformationAction>) => {
  disptach(loadingUser());
  
  const response =  await api.get('/alluserinformation');

  if (response.status === HttpStatusCode.OK) {
    disptach(setAllUser(response.data.data as User[]));
  } else {
    disptach(errorUser('Some error occured, try again.'));
  }
};

const updateUserDiscount = (discount: string, email: string) =>  async (disptach: Dispatch<UserInformationAction>) => {
  disptach(loadingUser());
  
  const response =  await api.post('/userdiscount', {
    email,
    discount
  });

  if (response.status === HttpStatusCode.OK) {
    disptach(updateDiscount(email,discount, 'Discount Updated'));
  } else {
    disptach(errorUser('Some error occured, try again.'));
  }
};

export {
  userInformationReducer,
  getUser,
  saveUser,
  getAllUser,
  setUser,
  updateUserDiscount,
  defaultUser
};
