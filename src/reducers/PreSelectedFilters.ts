import { Action, Dispatch } from "redux";
import { SelectedFilters } from "types";

export interface PreSelectedFilterActions extends Action {
  readonly key: string;
  readonly data: number[] | string | SelectedFilters;
}

export interface PreSelectedFilters {
  readonly _isLoading: boolean;
  readonly _isSuccess: boolean;
  readonly data?: SelectedFilters;
}

const initialState = {
  _isLoading: false,
  _isSuccess: false,
  data: {
    subcategoryId:[],
    coloudId:[],
    sizeId:[],
    startPrice:'',
    endPrice:'',
    subcategoryname: '',
    searchText:'',
    scrollTill: '0',
    lastViewedProductId: '',
  } as SelectedFilters
} as PreSelectedFilters;

enum Actions {
  LOADING_FILTERS = 'LOADING_FILTERS',
  SUCCESS_FILTERS = 'SUCCESS_FILTERS',
  SET_FILTER = 'SET_FILTER',
  SET_ALL_FILTER = 'SET_ALL_FILTER',
  DEFAULT_FILTER = 'DEFAULT_FILTER'
}

const loadingColour = () => ({
  type: Actions.LOADING_FILTERS
});

const successColour = () => ({
  type: Actions.SUCCESS_FILTERS,
});

const defaultPreSelectedFitler = () => ({
  type: Actions.DEFAULT_FILTER
});

const setPreSelectedFilter =(key:string, data: number[] | string) => ({
  type: Actions.SUCCESS_FILTERS,
  key,
  data
});

const setAllFilters = (data:SelectedFilters) => ({
  type: Actions.SET_ALL_FILTER,
  data
});

const PreSelectedFiltersReducer = (state= initialState, actions: PreSelectedFilterActions):PreSelectedFilters =>{
  switch(actions.type){
    case Actions.SUCCESS_FILTERS:
      return {
        ...state,
        data :{
          ...state.data,
          [actions.key]: actions.data
        } as SelectedFilters
      }
    case Actions.SET_ALL_FILTER:
      return {
        ...state,
        data : actions.data  as SelectedFilters
      }
    case Actions.DEFAULT_FILTER:
      return {
        _isLoading: false,
        _isSuccess: true,
        data: {
          subcategoryId:[],
          coloudId:[],
          sizeId:[],
          startPrice:'',
          endPrice:'',
          subcategoryname: '',
          searchText:'',
          scrollTill: '0',
          lastViewedProductId: '',
        } as SelectedFilters
      }
    default:
      return state
  }
}

export {
  PreSelectedFiltersReducer,
  setPreSelectedFilter,
  defaultPreSelectedFitler,
  setAllFilters
}