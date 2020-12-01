import { Dispatch, Action } from 'redux';
import { ActiveProductCount, ProductSubcategoryProperty } from 'types';
import { api, createProductCountList } from 'services';
import { HttpStatusCode } from "appConstants";

export interface ProductCountAction extends Action {
  readonly message?: string;
  readonly data?: ProductSubcategoryProperty;
};

export interface ProductCountResponse {
  readonly message?: string;
  readonly data?: ActiveProductCount[];
};

export interface ProductCount {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductSubcategoryProperty;
};

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  message: '',
  data: {}
} as ProductCount;

enum Actions {
  LOADING_PRODUCT_COUNT= 'LOADING_PRODUCT_COUNT',
  ERROR_PRODUCT_COUNT= 'ERROR_PRODUCT_COUNT',
  SET_PRODUCT_COUNT= 'SET_PRODUCT_COUNT',
};

const loadingProductCount = () => ({
  type: Actions.LOADING_PRODUCT_COUNT
});

const errorProductCount = (message: string) => ({
  type: Actions.ERROR_PRODUCT_COUNT,
  message
});

const setProductCount = (data: ProductSubcategoryProperty) => ({
  type: Actions.SET_PRODUCT_COUNT,
  data
});

const productCountReducer = (state= initialState, action: ProductCountAction): ProductCount => {
  switch(action.type) {
    case Actions.LOADING_PRODUCT_COUNT:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess:false,
        message: ''
      }
    case Actions.ERROR_PRODUCT_COUNT:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        message: action.message
      }
    case Actions.SET_PRODUCT_COUNT:
      return {
        ...state,
        _isError: false,
        _isLoading: false,
        _isSuccess: true,
        message: action.message,
        data : action.data
      }
    default:
      return state
  }
};

/** Thunk */

const getActiveProductCount = () => async(dispatch: Dispatch<ProductCountAction>) => {
  dispatch(loadingProductCount());

  const response = await api.get('/productcount');
  if(response.status === HttpStatusCode.OK){
    const res = response.data as ProductCountResponse;
    dispatch(setProductCount(createProductCountList(res.data||[])));
  } else {
    const res = response as ProductCountResponse;
    dispatch(errorProductCount(res.message || ''))
  }
};

export {
  productCountReducer,
  getActiveProductCount
}