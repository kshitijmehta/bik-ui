import {Action, Dispatch} from 'redux';

import { UserSettings } from 'types';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';

/* Interface*/
export interface UserSettingsAction extends Action {
  readonly data?: UserSettings;
}

export interface UserSetting {
  readonly data?: UserSettings;
  _isLoading: boolean;
  _isError: boolean;
}

const initialState = {
  data : {
    emailAddress : '',
  },
  _isLoading: false,
  _isError: false
} as UserSetting

/* Actions */

enum Actions {
  SET_USER_SETTINGS = "SET_USER_SETTINGS",
  LOADING_USER_SETTINGS = "LOADING_USER_SETTINGS",
  ERROR_USER_SETTINGS = "ERROR_USER_SETTINGS"
}

const setUserSetting = (userSettings: UserSettings) => ({
  type: Actions.SET_USER_SETTINGS,
  data: userSettings
});

const loadingUserSettings = () => ({
  type: Actions.LOADING_USER_SETTINGS
});

const errorUserSettings = () => ({
  type: Actions.ERROR_USER_SETTINGS
});

const userSettingsReducer = (state = initialState, action: UserSettingsAction) => {
  switch(action.type) {
    case Actions.SET_USER_SETTINGS:
      return {
        ...state,
        data: action.data,
        _isLoading: false,
        _isError: false,
      };
    case Actions.LOADING_USER_SETTINGS:
      return{
        ...state,
        _isLoading: true,
        _isError: false
      };
    case Actions.ERROR_USER_SETTINGS:
      return{
        ...state,
        _isLoading: false,
        _isError: true
      };
    default:
      return state
  }
};

/* Thunk */

const getUserSettings = () => async (disptach: Dispatch<UserSettingsAction>) => {
  disptach(loadingUserSettings());
  
  const response =  await api.get('/passwordchange');

  if (response.status === HttpStatusCode.OK) {
    disptach(setUserSetting(response.data.data as UserSettings));
  } else {
    disptach(errorUserSettings());
  }
};


const saveUserSettings = (data: UserSettings) => async (disptach: Dispatch<UserSettingsAction>) => {
  disptach(loadingUserSettings());
  
  const response =  await api.post('/passwordchange', data);

  if (response.status === HttpStatusCode.OK) {
    disptach(setUserSetting({emailAddress : data.emailAddress, currentPassword: '', newPassword: ''} as UserSettings));
  } else {
    disptach(errorUserSettings());
  }
};

export {
  userSettingsReducer,
  getUserSettings,
  saveUserSettings
}