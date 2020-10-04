import { createStore, combineReducers, Store, applyMiddleware, compose, Action } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { userInformationReducer, UserInformation, UserInformationAction } from './UserInformation';
import { userLoginReducer, UserLoginRegister } from './Login';
import { userSettingsReducer, UserSetting } from './UserSettings';
import { Colour, colourReducer, ColourAction } from './Colour';
import { sizeReducer, Size, SizeAction } from './Size';
import { SubCategory, subCategoryReducer, SubCategoryAction } from './SubCategory';
import { Coupon, couponReducer, CouponAction } from './Coupon';
import { Product, productReducer, ProductAction } from './Product';


export type AppState = {
  user: UserInformation;
  userLogin: UserLoginRegister;
  userSettings: UserSetting;
  colour: Colour;
  size: Size;
  subCategory: SubCategory;
  coupon: Coupon,
  product: Product
}

const reducers = {
  user: userInformationReducer,
  userLogin: userLoginReducer,
  userSettings: userSettingsReducer,
  colour: colourReducer,
  size: sizeReducer,
  subCategory: subCategoryReducer,
  coupon: couponReducer,
  product: productReducer,
};

interface AppActions {
  user: UserInformationAction;
  colour: ColourAction;
  size: SizeAction;
  subcategory: SubCategoryAction;
  coupon: CouponAction;
  product: ProductAction
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
export * from './Colour';
export * from './Size';
export * from './SubCategory';
export * from './Coupon';
export * from './Product';