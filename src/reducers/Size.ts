import {Action, Dispatch} from 'redux';
import { ProductSize } from 'types';
import { api, getSubCategoryFromId } from 'services';
import { HttpStatusCode } from 'appConstants';


export interface SizeAction extends Action {
  readonly message?: string;
  readonly data?: ProductSize[];
}

interface SizeResponse {
   message?: string;
   data?: ProductSize[];
}

export interface Size {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductSize[];
}

enum Actions{
  LOADING_SIZE= 'LOADING_SIZE',
  SUCCESS_SIZE= 'SUCCESS_SIZE',
  ERROR_SIZE= 'ERROR_SIZE',
  SET_SIZE= 'SET_SIZE',
  UPDATE_SIZE= 'UPDATE_SIZE',
}

const loadingSize= () => ({
  type: Actions.LOADING_SIZE
});

const successSize= (message: string) => ({
  type: Actions.SUCCESS_SIZE,
  message
});

const errorSize= (message: string) => ({
  type: Actions.SUCCESS_SIZE,
  message
});

const setSize= (data: ProductSize[]) => ({
  type: Actions.SET_SIZE,
  data
});

const updateSize= (data: ProductSize[], message: string) => ({
  type: Actions.UPDATE_SIZE,
  data,
  message
});

const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  message: '',
  data:[]
} as Size


const sizeReducer = (state= initialState, action: SizeAction): Size => {
  switch(action.type){
    case Actions.SUCCESS_SIZE:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.LOADING_SIZE:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      }
    case Actions.ERROR_SIZE:
      return {
        ...state,
        _isError: true,
        _isSuccess: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.SET_SIZE:
      return {
        ...state,
        _isLoading: false,
        _isSuccess: false,
        _isError: false,
        message: '',
        data: action.data
      }
    case Actions.UPDATE_SIZE:
      const originalState = state.data || [];
      const updatedValue = action.data || [];
      const updatedState = originalState.filter(d => {
        return d.sizeId != updatedValue[0].sizeId
      });
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: [
          ...updatedState,
          ...updatedValue,
        ]
      }
    default:
      return state
  }
}

/**Thunk */

const addUpdateSize = (size: ProductSize) => async (dispatch: Dispatch<SizeAction>) => {
  dispatch(loadingSize());

  const response = await api.post('/productsize',
    {
      product_size:size.value,
      product_size_code: size.code,
      product_category: Number(size.productCategory),
      size_id: size.sizeId
    });

  if(response.status === HttpStatusCode.OK){
    const res = response.data as SizeResponse;
    if(size.sizeId != '0'){
      const productCategoryIndex  = size.productCategory ? size.productCategory : 1;
      dispatch(updateSize([{...size, productCategoryName: getSubCategoryFromId(Number(productCategoryIndex))}], res.message || ''));
    } else{
      dispatch(successSize(res.message || ''));
    }
  } else {
    const res = response as SizeResponse;
    dispatch(errorSize(res.message || ''));
  }
}

const getSize= () => async (dispatch: Dispatch<SizeAction>) => {
  dispatch(loadingSize());

  const response = await api.get('/productsize');

  if(response.status === HttpStatusCode.OK){
    const res = response.data as SizeResponse;
    dispatch(setSize(res.data || []))
  } else {
    const res = response as SizeResponse;
    dispatch(errorSize(res.message || ''));
  }
}

export {
  addUpdateSize,
  sizeReducer,
  getSize
}