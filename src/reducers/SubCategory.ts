import { Action, Dispatch } from 'redux';
import { ProductSubCategory } from 'types';
import { api, getSubCategoryFromId } from 'services';
import { HttpStatusCode, SubCategories } from 'appConstants';

export interface SubCategoryAction extends Action {
  readonly message?: string;
  readonly data?: ProductSubCategory[];
}

interface SubCategoryResponse {
  message?: string;
  data?: ProductSubCategory[];
}

export interface SubCategory {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductSubCategory[];
}

enum Actions{
  LOADING_SUBCATEGORY= 'LOADING_SUBCATEGORY',
  SUCCESS_SUBCATEGORY= 'SUCCESS_SUBCATEGORY',
  ERROR_SUBCATEGORY= 'ERROR_SUBCATEGORY',
  SET_SUBCATEGORY= 'SET_SUBCATEGORY',
  UPDATE_SUBCATEGORY= 'UPDATE_SUBCATEGORY',
}

const loadingSubCategory= () => ({
  type: Actions.LOADING_SUBCATEGORY
});

const successSubCategory= (message: string) => ({
  type: Actions.SUCCESS_SUBCATEGORY,
  message
});

const errorSubCategory= (message: string) => ({
  type: Actions.ERROR_SUBCATEGORY,
  message
});

const setSubCategory= (data: ProductSubCategory[]) => ({
  type: Actions.SET_SUBCATEGORY,
  data
});

const updateSubCategory= (data: ProductSubCategory[], message: string) => ({
  type: Actions.UPDATE_SUBCATEGORY,
  data,
  message
});

const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  message: '',
  data:[]
} as SubCategory

const subCategoryReducer = (state= initialState, action: SubCategoryAction): SubCategory => {
  switch(action.type){
    case Actions.SUCCESS_SUBCATEGORY:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.LOADING_SUBCATEGORY:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      }
    case Actions.ERROR_SUBCATEGORY:
      return {
        ...state,
        _isError: true,
        _isSuccess: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.SET_SUBCATEGORY:
      return {
        ...state,
        _isLoading: false,
        _isSuccess: false,
        _isError: false,
        message: '',
        data: action.data
      }
    case Actions.UPDATE_SUBCATEGORY:
      const originalState = state.data || [];
      const updatedValue = action.data || [];
      const updatedState = originalState.filter(d => {
        return d.subCategoryId != updatedValue[0].subCategoryId
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

/* Thunk */

const addUpdateSubCategory = (subCategory: ProductSubCategory) => async (dispatch: Dispatch<SubCategoryAction>) => {
  dispatch(loadingSubCategory());

  const response = await api.post('/productsubcategory',
    {
      product_name:subCategory.code,
      product_desc: subCategory.value,
      product_category_id: Number(subCategory.productCategoryId),
      subcategory_id: subCategory.subCategoryId?.toString()
    });

  if(response.status === HttpStatusCode.OK){
    const res = response.data as SubCategoryResponse;
    if(subCategory.subCategoryId != '0'){
      const productCategoryIndex  = subCategory.productCategoryId ? subCategory.productCategoryId : 1;
      dispatch(updateSubCategory([{...subCategory, productCategoryName: getSubCategoryFromId(Number(productCategoryIndex))}], res.message || ''));
    } else{
      dispatch(successSubCategory(res.message || ''));
    }
  } else {
    const res = response as SubCategoryResponse;
    dispatch(errorSubCategory(res.message || ''));
  }
}


const getSubCategory= () => async (dispatch: Dispatch<SubCategoryAction>) => {
  dispatch(loadingSubCategory());

  const response = await api.get('/productsubcategory');

  if(response.status === HttpStatusCode.OK){
    const res = response.data as SubCategoryResponse;
    dispatch(setSubCategory(res.data || []))
  } else {
    const res = response as SubCategoryResponse;
    dispatch(errorSubCategory(res.message || ''));
  }
}

export {
  subCategoryReducer,
  getSubCategory,
  addUpdateSubCategory
}