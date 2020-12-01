import { Action, Dispatch } from 'redux';
import { Order, OrderItems, OrderUpdateAdmin } from 'types';
import { api } from 'services';
import { HttpStatusCode, pageSize } from 'appConstants';

export interface CustomerOrderAction extends Action {
  readonly message?: string;
  readonly data?: Order[];
  readonly singleData?: Order;
  readonly _hasMoreOrders?: boolean;
};

interface CustomerOrderResponse {
  message?: string;
  data?: Order[];
  singleData?: Order;
  _hasMoreOrders?: boolean;
};

export interface CustomerOrders {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly _hasMoreOrders?: boolean;
  readonly _isOrderUpdate?: boolean;
  readonly message?: string;
  readonly data?: Order[];
  readonly singleData?: Order;
};

enum Actions{
  LOADING_ORDER= 'LOADING_ORDER',
  SUCCESS_ORDER= 'SUCCESS_ORDER',
  ADMIN_SUCCESS_ORDER= 'ADMIN_SUCCESS_ORDER',
  ERROR_ORDER= 'ERROR_ORDER',
  SINGLE_DATA = 'SINGLE_DATA',
  CUSTOMER_RETURN = 'CUSTOMER_RETURN',
  DEFAULT_ORDER_RETURN = 'DEFAULT_ORDER_RETURN'
};

const loadingOrder= () => ({
  type: Actions.LOADING_ORDER
});

const successOrder= (data: Order[], _hasMoreOrders: boolean) => ({
  type: Actions.SUCCESS_ORDER,
  data,
  _hasMoreOrders
});

const adminSuccessOrder= (data: Order[]) => ({
  type: Actions.ADMIN_SUCCESS_ORDER,
  data
});

const errorOrder= (message: string) => ({
  type: Actions.ERROR_ORDER,
  message
});

const singleOrder= (singleData: Order) => ({
  type: Actions.SINGLE_DATA,
  singleData
});

const customerReturn = (orderDetailsId: number) => ({
  type: Actions.CUSTOMER_RETURN,
  singleData: {
   orderId: orderDetailsId.toString()
  } as Order
});

const defaulOrderReturn = () => ({
  type: Actions.DEFAULT_ORDER_RETURN
});

const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  _hasMoreOrders: false,
  _isOrderUpdate: false,
  message: '',
  data:[],
  singleData: {} as Order,
} as CustomerOrders

const customerOrdersReducer = (state= initialState, action: CustomerOrderAction): CustomerOrders => {
  switch(action.type){
    case Actions.LOADING_ORDER:
      return {
        ...state,
        _isSuccess: false,
        _isError: false,
        _isLoading: true,
        _hasMoreOrders: false,
        _isOrderUpdate: false,
      }
    case Actions.SUCCESS_ORDER:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _isOrderUpdate: false,
        message: action.message,
        data: state.data?.concat(action.data || []),
        _hasMoreOrders: action._hasMoreOrders
      }
    case Actions.ADMIN_SUCCESS_ORDER:
    return {
      ...state,
      _isSuccess: true,
      _isError: false,
      _isLoading: false,
      _isOrderUpdate: false,
      message: action.message,
      data: action.data
    }
    case Actions.SINGLE_DATA:
      return{
        ...state,
        _isSuccess: false,
        _isError: false,
        _isLoading: false,
        _hasMoreOrders: false,
        _isOrderUpdate: false,
        singleData: action.singleData
      }
    case Actions.ERROR_ORDER:
      return {
        ...state,
        _isSuccess: false,
        _isError: true,
        _isLoading: false,
        message: action.message,
        _hasMoreOrders: false,
        _isOrderUpdate: false,
      }
    case Actions.DEFAULT_ORDER_RETURN:
      return {
        ...state,
        _isOrderUpdate: false,
      }
    case Actions.CUSTOMER_RETURN:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _isOrderUpdate: true,
        message: action.message,
        data: state.data?.map((singleOrder) => {
          const updatedOrder = singleOrder.orderItems.map((order) => {
            if(order.orderDetailId.toString() === action.singleData?.orderId.toString()){
              return {...order, shipmentDetails: {...order.shipmentDetails, returnStatus: 'In Progress'}}
            } else {
              return order
            }
          })
          return {
            ...singleOrder,
            orderItems : updatedOrder
          }
        }),
      }
    default:
      return state
  }
};

/** Thunk */

const getCustomerOrders = (offset: number, limit: number) => async(dispatch: Dispatch<CustomerOrderAction>) => {
  dispatch(loadingOrder());
  const response = await api.get('/getcustomerorders?limit='+limit+'&offset='+offset);

  if(response.status === HttpStatusCode.OK){
    const res = response.data as CustomerOrderResponse;
    const _hasMoreOrders = res.data && res.data.length === pageSize || false;
    dispatch(successOrder(res.data || [], _hasMoreOrders))
  } else {
    const res = response as CustomerOrderResponse;
    dispatch(errorOrder(res.message || ''));
  }
}

const getAdminOrders = (userId=0) => async(dispatch: Dispatch<CustomerOrderAction>) => {
  dispatch(loadingOrder());
  const response = await api.get('/getadminorders?userId='+userId);

  if(response.status === HttpStatusCode.OK){
    const res = response.data as CustomerOrderResponse;
    dispatch(adminSuccessOrder(res.data || []))
  } else {
    const res = response as CustomerOrderResponse;
    dispatch(errorOrder(res.message || ''));
  }
};

const customerProductReturn = (orderDetailsId: number, returnReason: string) => async(dispatch: Dispatch<CustomerOrderAction>) => {
  dispatch(loadingOrder());
  const response = await api.post('/customerproductreturn',{
    orderDetailsId,
    returnReason
  });
  if(response.status === HttpStatusCode.OK){
    const res = response.data as CustomerOrderResponse;
    dispatch(customerReturn(orderDetailsId))
  } else {
    const res = response as CustomerOrderResponse;
    dispatch(errorOrder(res.message || ''));
  }
}

export {
  getCustomerOrders,
  customerOrdersReducer,
  getAdminOrders,
  singleOrder,
  customerProductReturn,
  defaulOrderReturn
}