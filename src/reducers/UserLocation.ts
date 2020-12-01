import {Action, Dispatch} from 'redux';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';


export interface UserLocationAction extends Action {
  readonly data?: string;
};

export interface UserLocation {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: string;
};

enum Actions{
  LOADING_USER_LOCATION= 'LOADING_USER_LOCATION',
  SET_USER_LOCATION= 'SET_USER_LOCATION',
};

const loadingUserLocation = () => ({
  type: Actions.LOADING_USER_LOCATION,
});

const setUserLocation = (data: string) => ({
  type: Actions.SET_USER_LOCATION,
  data
});

const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  message: '',
  data:''
} as UserLocation

const userLocationReducer = (state= initialState, action: UserLocationAction): UserLocation => {
  switch(action.type){
    case Actions.LOADING_USER_LOCATION:
      return{
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      }
    case Actions.SET_USER_LOCATION:
      return{
        ...state,
        _isLoading: false,
        _isError: false,
        _isSuccess: false,
        data: action.data
      }
    default:
      return state
  }
}
/** Thunk */

const getUserLocation = () => async (dispatch: Dispatch<UserLocationAction>) => {
  dispatch(loadingUserLocation());
  const defaultUserLocation = 'Asia/Calcutta';
  try {
    const userLocation = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(userLocation && userLocation.toLowerCase() === defaultUserLocation.toLowerCase()){
      dispatch(setUserLocation('IN'));
    } else if (!userLocation && (new Date).getTimezoneOffset() === -330){
      dispatch(setUserLocation('IN'));
    } else {
      dispatch(setUserLocation('USD'));
    }
  } catch (error) {
    dispatch(setUserLocation('IN'));
  }
};

export {
  userLocationReducer,
  getUserLocation
}