import {Action, Dispatch} from 'redux';

import { UserSettings } from 'types';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';

/* Interface*/
export interface UserSettingsAction extends Action {
  readonly data?: UserSettings;
  readonly message?: string;
}

export interface UserSetting {
  readonly data?: UserSettings;
  _isLoading: boolean;
  _isError: boolean;
  _isSuccess: boolean;
  message?: string;
}

const initialState = {
  data : {
    emailAddress : '',
  },
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  message: '',
} as UserSetting

/* Actions */

enum Actions {
  SET_USER_SETTINGS = "SET_USER_SETTINGS",
  LOADING_USER_SETTINGS = "LOADING_USER_SETTINGS",
  ERROR_USER_SETTINGS = "ERROR_USER_SETTINGS"
}

const setUserSetting = (userSettings: UserSettings, message?: string) => ({
  type: Actions.SET_USER_SETTINGS,
  data: userSettings,
  message
});

const loadingUserSettings = () => ({
  type: Actions.LOADING_USER_SETTINGS
});

const errorUserSettings = (message?: string) => ({
  type: Actions.ERROR_USER_SETTINGS,
  message
});

const userSettingsReducer = (state = initialState, action: UserSettingsAction) => {
  switch(action.type) {
    case Actions.SET_USER_SETTINGS:
      return {
        ...state,
        data: action.data,
        _isLoading: false,
        _isError: false,
        _isSuccess: true,
        message: action.message
      };
    case Actions.LOADING_USER_SETTINGS:
      return{
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false,
      };
    case Actions.ERROR_USER_SETTINGS:
      return{
        ...state,
        _isLoading: false,
        _isError: true,
        _isSuccess: false,
        message: action.message
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
    disptach(errorUserSettings(response.data.message|| ''));
  }
};


const saveUserSettings = (data: UserSettings) => async (disptach: Dispatch<UserSettingsAction>) => {
  disptach(loadingUserSettings());
  
  const response =  await api.post('/passwordchange', data);

  if (response.status === HttpStatusCode.OK) {
    disptach(setUserSetting({emailAddress : data.emailAddress, currentPassword: '', newPassword: ''} as UserSettings,response.data.message|| ''));
  } else {
    disptach(errorUserSettings((response as any).message|| ''));
  }
};

export {
  userSettingsReducer,
  getUserSettings,
  saveUserSettings
}