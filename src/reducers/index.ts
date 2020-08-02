import { createStore, combineReducers, Store, applyMiddleware, compose, Action } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { userInformationReducer, UserInformation, UserInformationAction } from './UserInformation';
import { userLoginReducer, UserLoginRegister } from './Login';
import { userSettingsReducer, UserSetting } from './UserSettings';


export type AppState = {
  user: UserInformation;
  userLogin: UserLoginRegister;
  userSettings: UserSetting;
}

const reducers = {
  user: userInformationReducer,
  userLogin: userLoginReducer,
  userSettings: userSettingsReducer
};

interface AppActions {
  user: UserInformationAction;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
    store: Store<AppState>;
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<AppState, Action<AppActions>, any, any>(
  combineReducers(reducers), 
  composeEnhancers(applyMiddleware(thunkMiddleware)
  ));

export { store };
export * from './UserInformation';
export * from './Login';
export * from './UserSettings';