import { Action, Dispatch } from "redux";
import { OrderShipper, Order } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

export interface ShipperAction extends Action {
  readonly message?: string;
  readonly data?: OrderShipper[]
}

export interface ShipperResponse {
  message?: string
  data?: OrderShipper[]
}

export interface Shipper {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: OrderShipper[];
}

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  message: '',
  data: []
} as Shipper

enum Actions {
  LOADING_SHIPPER = 'LOADING_SHIPPER',
  ERROR_SHIPPER = 'ERROR_SHIPPER',
  SUCCESS_SHIPPER = 'SUCCESS_SHIPPER',
  DEFAULT_SHIPPER = 'DEFAULT_SHIPPER',
  SET_SHIPPER = 'SET_SHIPPER',
  UPDATE_SHIPPER_SUCCESS = 'UPDATE_SHIPPER_SUCCESS',
  DELETE_SHIPPER_SUCCESS = 'DELETE_SHIPPER_SUCCESS'
}

const loadingShipper = () => ({
  type: Actions.LOADING_SHIPPER
});

const successShipper = (message: string) => ({
  type: Actions.SUCCESS_SHIPPER,
  message
});

const errorShipper = (message: string) => ({
  type: Actions.ERROR_SHIPPER,
  message
});

const defaultShipper = () => ({
  type: Actions.DEFAULT_SHIPPER
});

const setShipper = (data: OrderShipper[]) => ({
  type: Actions.SET_SHIPPER,
  data
});

const updateShipperSuccess = (data: OrderShipper[], message: string) => ({
  type: Actions.UPDATE_SHIPPER_SUCCESS,
  data,
  message
});

const deleteShipperSuccess = (data: OrderShipper[], message: string) => ({
  type: Actions.DELETE_SHIPPER_SUCCESS,
  data,
  message
});

const shipperReducer = (state = initialState, action: ShipperAction): Shipper => {
  switch (action.type) {
    case Actions.LOADING_SHIPPER:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess:false,
        message: ''
      }
    case Actions.SUCCESS_SHIPPER:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.ERROR_SHIPPER:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        message: action.message
      }
    case Actions.SET_SHIPPER:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: action.data
      }
    case Actions.UPDATE_SHIPPER_SUCCESS:
      const originalState = state.data || [];
      const updatedValue = action.data || [];
      const updatedState = originalState.filter(d => {
        return d.shipperId != updatedValue[0].shipperId
      });
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: [
          ...updatedState,
          ...updatedValue
        ]
      }
    case Actions.DELETE_SHIPPER_SUCCESS:
      const orgState = state.data || [];
      const updValue = action.data || [];
      const updState = orgState.filter(d => {
        return d.shipperId != updValue[0].shipperId
      });
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: [
          ...updState
        ]
      }
    case Actions.DEFAULT_SHIPPER:
      return {
        ...state,
        ...initialState
      }
    default:
      return state
  }
}

/** Thunk */

const saveShipper = (shipper: OrderShipper) => async (dispatch: Dispatch<ShipperAction>) => {
  dispatch(loadingShipper());
  const response = await api.post('/shipper',
    {
      shipper_name: shipper.shipperName,
      shipper_link: shipper.trackingLink,
      shipper_id: 0,
      delete_flag: false
    });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ShipperResponse
    dispatch(successShipper(res.message || ''));
  } else {
    const res = response as ShipperResponse
    dispatch(errorShipper(res.message || ''));
  }
}

const getShippers = () => async (dispatch: Dispatch<ShipperAction>) => {
  dispatch(loadingShipper());

  const response = await api.get('/shipper');
  if(response.status === HttpStatusCode.OK){
    const res = response.data as ShipperResponse;
    dispatch(setShipper(res.data || []));
  } else {
    const res = response as ShipperResponse;
    dispatch(errorShipper(res.message || ''))
  }
}

const updateShipper = (shipper: OrderShipper, delete_flag= false) => async (dispatch: Dispatch<ShipperAction>) => {
  dispatch(loadingShipper());

  const response = await api.post('/shipper', {
    shipper_name: shipper.shipperName,
    shipper_link: shipper.trackingLink,
    shipper_id: shipper.shipperId,
    delete_flag
  });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ShipperResponse;
    if(delete_flag){
      dispatch(deleteShipperSuccess([shipper], res.message || ''))
    }else {
      dispatch(updateShipperSuccess([shipper], res.message || ''));
    }
  } else {
    const res = response as ShipperResponse
    dispatch(errorShipper(res.message || ''));
  }

}

export {
  shipperReducer,
  saveShipper,
  getShippers,
  updateShipper
}