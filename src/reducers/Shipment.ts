import { Action, Dispatch } from 'redux';
import { OrderUpdateAdmin } from 'types';
import { api } from 'services';
import { HttpStatusCode, pageSize } from 'appConstants';

export interface ShipmentAction extends Action {
  readonly message?: string;
  readonly data?: OrderUpdateAdmin;
};

interface ShipmentResponse {
  message?: string;
  data?: OrderUpdateAdmin;
};

export interface Shipment {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly _hasMoreOrders?: boolean;
  readonly message?: string;
  readonly data?: OrderUpdateAdmin;
};

enum Actions{
  LOADING_SHIPMENT= 'LOADING_SHIPMENT',
  SUCCESS_SHIPMENT= 'SUCCESS_SHIPMENT',
  ERROR_SHIPMENT= 'ERROR_SHIPMENT',
};

const loadingShipment= (data: OrderUpdateAdmin) => ({
  type: Actions.LOADING_SHIPMENT,
  data
});

const successShipment= (data: OrderUpdateAdmin, message: string) => ({
  type: Actions.SUCCESS_SHIPMENT,
  data,
  message,
});

const errorShipment= (message: string) => ({
  type: Actions.ERROR_SHIPMENT,
  message,
});

const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  _hasMoreOrders: false,
  message: '',
  data:{}
} as Shipment

const shipmentReducer = (state= initialState, action: ShipmentAction): Shipment => {
  switch(action.type){
    case Actions.LOADING_SHIPMENT:
      return {
        ...state,
        _isSuccess: false,
        _isError: false,
        _isLoading: true,
        data: action.data,
      }
    case Actions.SUCCESS_SHIPMENT:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: action.data
      }
    case Actions.ERROR_SHIPMENT:
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

/** Thunk */

const updateOrderAdmin = (orderUpdate: OrderUpdateAdmin) => async(dispatch: Dispatch<ShipmentAction>) => {
  dispatch(loadingShipment(orderUpdate));
  const response = await api.post('/shipment',{
    deliveryDate: orderUpdate.deliveryDate,
    orderDetailId: orderUpdate.orderDetailId,
    paymentReturned: orderUpdate.paymentReturned?.toString(),
    returnStatus: orderUpdate.returnStatus?.toString(),
    shipmentId: orderUpdate.shipmentId,
    shipper: orderUpdate.shipper?.toString(),
    shippingDate: orderUpdate.shippingDate,
    trackingNumber: orderUpdate.trackingNumber?.toString() || ''
  } as OrderUpdateAdmin);
  if(response.status === HttpStatusCode.OK){
    const res = response.data as ShipmentResponse;
    dispatch(successShipment(orderUpdate, res.message|| ''));
  } else {
    const res = response as ShipmentResponse;
    dispatch(errorShipment(res.message || ''));
  }
}

export {
  shipmentReducer,
  updateOrderAdmin
}