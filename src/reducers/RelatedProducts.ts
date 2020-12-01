import {Action, Dispatch} from 'redux';
import { ProductItem } from 'types';
import { api } from 'services';
import { HttpStatusCode } from 'appConstants';


export interface RelatedProductAction extends Action {
  readonly message?: string;
  readonly data?: ProductItem[];
}

interface RelatedProductResponse {
   message?: string;
   data?: ProductItem[];
}

export interface RelatedProduct {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductItem[];
}

enum Actions{
  LOADING_RELATED_PRODUCT= 'LOADING_RELATED_PRODUCT',
  SUCCESS_RELATED_PRODUCT= 'SUCCESS_RELATED_PRODUCT',
  ERROR_RELATED_PRODUCT= 'ERROR_RELATED_PRODUCT',
  SET_RELATED_PRODUCT= 'SET_RELATED_PRODUCT',
}

const loadingRelatedProduct= () => ({
  type: Actions.LOADING_RELATED_PRODUCT
});

const successRelatedProduct= (message: string) => ({
  type: Actions.SUCCESS_RELATED_PRODUCT,
  message
});

const errorRelatedProduct= (message: string) => ({
  type: Actions.SUCCESS_RELATED_PRODUCT,
  message
});

const setRelatedProduct= (data: ProductItem[]) => ({
  type: Actions.SET_RELATED_PRODUCT,
  data
});


const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  message: '',
  data:[]
} as RelatedProduct


const relatedProductReducer = (state= initialState, action: RelatedProductAction): RelatedProduct => {
  switch(action.type){
    case Actions.SUCCESS_RELATED_PRODUCT:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.LOADING_RELATED_PRODUCT:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      }
    case Actions.ERROR_RELATED_PRODUCT:
      return {
        ...state,
        _isError: true,
        _isSuccess: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.SET_RELATED_PRODUCT:
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


const getRelatedProduct= (subcategoryId: number, productId: number) => async (dispatch: Dispatch<RelatedProductAction>) => {
  dispatch(loadingRelatedProduct());

  const response = await api.post('/relatedproducts',{
    subcategoryId,
    productId
  });

  if(response.status === HttpStatusCode.OK){
    const res = response.data as RelatedProductResponse;
    dispatch(setRelatedProduct(res.data || []))
  } else {
    const res = response as RelatedProductResponse;
    dispatch(errorRelatedProduct(res.message || ''));
  }
}

export {
  relatedProductReducer,
  getRelatedProduct
}