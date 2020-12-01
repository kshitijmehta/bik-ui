import {Action, Dispatch} from 'redux';
import { ProductItem } from 'types';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';


export interface LatestProductAction extends Action {
  readonly message?: string;
  readonly data?: ProductItem[];
}

interface LatestProductResponse {
   message?: string;
   data?: ProductItem[];
}

export interface LatestProduct {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductItem[];
}

enum Actions{
  LOADING_LATEST_PRODUCT= 'LOADING_LATEST_PRODUCT',
  SUCCESS_LATEST_PRODUCT= 'SUCCESS_LATEST_PRODUCT',
  ERROR_LATEST_PRODUCT= 'ERROR_LATEST_PRODUCT',
  SET_LATEST_PRODUCT= 'SET_LATEST_PRODUCT',
}

const loadingLatestProduct= () => ({
  type: Actions.LOADING_LATEST_PRODUCT
});

const successLatestProduct= (message: string) => ({
  type: Actions.SUCCESS_LATEST_PRODUCT,
  message
});

const errorLatestProduct= (message: string) => ({
  type: Actions.SUCCESS_LATEST_PRODUCT,
  message
});

const setLatestProduct= (data: ProductItem[]) => ({
  type: Actions.SET_LATEST_PRODUCT,
  data
});


const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  message: '',
  data:[]
} as LatestProduct


const latestProductReducer = (state= initialState, action: LatestProductAction): LatestProduct => {
  switch(action.type){
    case Actions.SUCCESS_LATEST_PRODUCT:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.LOADING_LATEST_PRODUCT:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      }
    case Actions.ERROR_LATEST_PRODUCT:
      return {
        ...state,
        _isError: true,
        _isSuccess: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.SET_LATEST_PRODUCT:
      return {
        ...state,
        _isLoading: false,
        _isSuccess: false,
        _isError: false,
        message: '',
        data: action.data
      }
    default:
      return state
  }
}

/**Thunk */


const getLatestProduct= () => async (dispatch: Dispatch<LatestProductAction>) => {
  dispatch(loadingLatestProduct());

  const response = await api.get('/trendinglatest?type=1');

  if(response.status === HttpStatusCode.OK){
    const res = response.data as LatestProductResponse;
    dispatch(setLatestProduct(res.data || []))
  } else {
    const res = response as LatestProductResponse;
    dispatch(errorLatestProduct(res.message || ''));
  }
}

export {
  latestProductReducer,
  getLatestProduct
}