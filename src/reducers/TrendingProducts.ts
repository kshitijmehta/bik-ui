import {Action, Dispatch} from 'redux';
import { ProductItem } from 'types';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';


export interface TrendingProductAction extends Action {
  readonly message?: string;
  readonly data?: ProductItem[];
}

interface TrendingProductResponse {
   message?: string;
   data?: ProductItem[];
}

export interface TrendingProduct {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductItem[];
}

enum Actions{
  LOADING_TRENDING_PRODUCT= 'LOADING_TRENDING_PRODUCT',
  SUCCESS_TRENDING_PRODUCT= 'SUCCESS_TRENDING_PRODUCT',
  ERROR_TRENDING_PRODUCT= 'ERROR_TRENDING_PRODUCT',
  SET_TRENDING_PRODUCT= 'SET_TRENDING_PRODUCT',
}

const loadingTrendingProduct= () => ({
  type: Actions.LOADING_TRENDING_PRODUCT
});

const successTrendingProduct= (message: string) => ({
  type: Actions.SUCCESS_TRENDING_PRODUCT,
  message
});

const errorTrendingProduct= (message: string) => ({
  type: Actions.SUCCESS_TRENDING_PRODUCT,
  message
});

const setTrendingProduct= (data: ProductItem[]) => ({
  type: Actions.SET_TRENDING_PRODUCT,
  data
});


const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  message: '',
  data:[]
} as TrendingProduct


const trendingProductReducer = (state= initialState, action: TrendingProductAction): TrendingProduct => {
  switch(action.type){
    case Actions.SUCCESS_TRENDING_PRODUCT:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.LOADING_TRENDING_PRODUCT:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      }
    case Actions.ERROR_TRENDING_PRODUCT:
      return {
        ...state,
        _isError: true,
        _isSuccess: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.SET_TRENDING_PRODUCT:
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


const getTrendingProduct= () => async (dispatch: Dispatch<TrendingProductAction>) => {
  dispatch(loadingTrendingProduct());

  const response = await api.get('/trendinglatest?type=2');

  if(response.status === HttpStatusCode.OK){
    const res = response.data as TrendingProductResponse;
    dispatch(setTrendingProduct(res.data || []))
  } else {
    const res = response as TrendingProductResponse;
    dispatch(errorTrendingProduct(res.message || ''));
  }
}

export {
  trendingProductReducer,
  getTrendingProduct
}