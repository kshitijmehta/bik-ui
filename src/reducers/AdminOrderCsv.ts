import { Action, Dispatch } from "redux";
import { AdminOrderDataCsv } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

export interface AdminOrderCsvAction extends Action {
  readonly message?: string;
  readonly data?: AdminOrderDataCsv[]
}

export interface AdminOrderCsvResponse {
  message?: string
  data?: AdminOrderDataCsv[]
}

export interface AdminOrderCsv {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: AdminOrderDataCsv[];
}

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  message: '',
  data: []
} as AdminOrderCsv;

enum Actions {
  LOADING_ADMIN_ORDER_CSV = 'LOADING_ADMIN_ORDER_CSV',
  ERROR_ADMIN_ORDER_CSV = 'ERROR_ADMIN_ORDER_CSV',
  SET_ADMIN_ORDER_CSV = 'SET_ADMIN_ORDER_CSV',
  SET_ADMIN_ORDER_CSV_DEFAULT = 'SET_ADMIN_ORDER_CSV_DEFAULT'
};

const loadingAdminOrderCsv = () => ({
  type: Actions.LOADING_ADMIN_ORDER_CSV
});

const errorAdminOrderCsv = (message: string) => ({
  type: Actions.ERROR_ADMIN_ORDER_CSV,
  message
});

const setAdminOrderCsv = (data: AdminOrderDataCsv[]) => ({
  type: Actions.SET_ADMIN_ORDER_CSV,
  data
});

const setAdminOrderCsvDefault = () => ({
  type: Actions.SET_ADMIN_ORDER_CSV_DEFAULT
});

const adminOrderCsvReducer = (state = initialState, action: AdminOrderCsvAction): AdminOrderCsv => {
  switch (action.type) {
    case Actions.LOADING_ADMIN_ORDER_CSV:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false,
      }
    case Actions.ERROR_ADMIN_ORDER_CSV:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        message: action.message
      }
    case Actions.SET_ADMIN_ORDER_CSV:
      return {
        ...state,
        _isLoading: false,
        _isError: false,
        _isSuccess: true,
        data: action.data
      }
    case Actions.SET_ADMIN_ORDER_CSV_DEFAULT:
      return{
        ...state,
        ...initialState
      }
    default:
      return state
  }
};

/** Thunk */

const getAdminOrderDataCsv = () => async (dispatch: Dispatch<AdminOrderCsvAction>) => {
  dispatch(loadingAdminOrderCsv());
  const response = await api.get('/getorderdatacsv');

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as AdminOrderCsvResponse;
    console.log(res)
    dispatch(setAdminOrderCsv(res.data || []));
  } else {
    const res = response as AdminOrderCsvResponse
    dispatch(errorAdminOrderCsv(res.message || ''));
  }
}

export {
  adminOrderCsvReducer,
  getAdminOrderDataCsv,
  setAdminOrderCsvDefault
}