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
import { ProductCount, productCountReducer, ProductCountAction } from './ProductCount';
import { Cart, cartReducer, CartAction } from './Cart';
import { Checkout, checkoutReducer, CheckoutAction } from './Checkout';
import { UserLocation, userLocationReducer, UserLocationAction } from './UserLocation';
import { CustomerOrders, customerOrdersReducer, CustomerOrderAction } from './Order';
import { Shipper, shipperReducer, ShipperAction } from './Shipper';
import { Shipment, shipmentReducer, ShipmentAction } from './Shipment';
import { relatedProductReducer, RelatedProduct, RelatedProductAction } from './RelatedProducts';
import { TrendingProduct, trendingProductReducer, TrendingProductAction } from './TrendingProducts';
import { LatestProduct, latestProductReducer, LatestProductAction } from './LatestProducts';
import { searchReducer, SearchAction, Search } from './Search';
import { CustomerShippment, customerShippmentReducer, CustomerShippmentAction } from './CustomerShippment';
import { PreSelectedFilterActions, PreSelectedFilters, PreSelectedFiltersReducer } from './PreSelectedFilters';
import { AdminOrderCsv, AdminOrderCsvAction, adminOrderCsvReducer } from './AdminOrderCsv';
import { ContactUs, ContactUsAction, contactUsReducer } from './ContactUs';


export type AppState = {
  user: UserInformation;
  userLogin: UserLoginRegister;
  userSettings: UserSetting;
  colour: Colour;
  size: Size;
  subCategory: SubCategory;
  coupon: Coupon;
  product: Product;
  productCount: ProductCount;
  cart: Cart;
  checkout: Checkout;
  userLocation: UserLocation;
  customerOrders: CustomerOrders;
  shipper: Shipper;
  shipment: Shipment;
  relatedProduct: RelatedProduct;
  trendingProduct: TrendingProduct;
  latestProduct: LatestProduct;
  search: Search;
  customerShippment: CustomerShippment;
  preSelectedFilters: PreSelectedFilters;
  adminOrderCsv: AdminOrderCsv;
  contactUs: ContactUs
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
  productCount: productCountReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  userLocation: userLocationReducer,
  customerOrders: customerOrdersReducer,
  shipper: shipperReducer,
  shipment: shipmentReducer,
  relatedProduct: relatedProductReducer,
  trendingProduct: trendingProductReducer,
  latestProduct: latestProductReducer,
  search: searchReducer,
  customerShippment: customerShippmentReducer,
  preSelectedFilters: PreSelectedFiltersReducer,
  adminOrderCsv: adminOrderCsvReducer,
  contactUs: contactUsReducer,
};

interface AppActions {
  user: UserInformationAction;
  colour: ColourAction;
  size: SizeAction;
  subcategory: SubCategoryAction;
  coupon: CouponAction;
  product: ProductAction;
  productCount: ProductCountAction;
  cart: CartAction;
  checkout: CheckoutAction;
  userLocation: UserLocationAction;
  customerOrders: CustomerOrderAction;
  shipper: ShipperAction;
  shipment: ShipmentAction;
  relatedProduct: RelatedProductAction;
  trendingProduct: TrendingProductAction;
  latestProduct: LatestProductAction;
  search: SearchAction;
  customerShippment: CustomerShippmentAction;
  preSelectedFilters: PreSelectedFilterActions;
  adminOrderCsv: AdminOrderCsvAction;
  contactUs: ContactUsAction;
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
export * from './ProductCount';
export * from './Cart';
export * from './Checkout';
export * from './UserLocation';
export * from './Order';
export * from './Shipper';
export * from './Shipment';
export * from './RelatedProducts';
export * from './TrendingProducts';
export * from './LatestProducts';
export * from './CustomerShippment';
export * from './PreSelectedFilters';
export * from './AdminOrderCsv';
export * from './ContactUs';