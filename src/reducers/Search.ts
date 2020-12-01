import { Action, Dispatch } from 'redux';
import { Search as ProductSearch } from 'types';
import { api } from 'services';
import { HttpStatusCode, pageSize } from 'appConstants';

export interface SearchAction extends Action {
  readonly message?: string;
  readonly data?: ProductSearch;
};

interface SearchResponse {
  message?: string;
  data?: ProductSearch;
};

export interface Search {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductSearch;
};

enum Actions{
  LOADING_SEARCH= 'LOADING_SEARCH',
  SET_SEARCH= 'SET_SEARCH',
  ERROR_SEARCH= 'ERROR_SEARCH',
};

const loadingSearch= (data: ProductSearch) => ({
  type: Actions.LOADING_SEARCH,
  data
});

const setSearch= (data: ProductSearch) => ({
  type: Actions.SET_SEARCH,
  data,
});

const errorSearch= (message: string) => ({
  type: Actions.ERROR_SEARCH,
  message,
});

const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  message: '',
  data:{}
} as Search

const searchReducer = (state= initialState, action: SearchAction): Search => {
  switch(action.type){
    case Actions.LOADING_SEARCH:
      return {
        ...state,
        _isSuccess: false,
        _isError: false,
        _isLoading: true,
        data: action.data,
      }
    case Actions.SET_SEARCH:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: action.data
      }
    case Actions.ERROR_SEARCH:
      return {
        ...state,
        _isSuccess: false,
        _isError: true,
        _isLoading: false,
        message: action.message,
      }
    default:
      return state
  }
};



export {
  searchReducer,
  setSearch
}