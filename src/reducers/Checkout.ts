import { Action, Dispatch } from "redux";
import { CustomerCheckout, RazorpayPayment, PayPalPayment, CodPayment } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

export interface CheckoutAction extends Action {
  readonly message?: string;
  readonly data?: CustomerCheckout;
}

export interface CheckoutResponse {
  message?: string
  data?: CustomerCheckout;
}

export interface Checkout {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly _isPaymentSucceess: boolean;
  readonly _priceChanged: boolean;
  readonly _isFetchCodCodeSuccess: boolean;
  readonly message?: string;
  readonly data?: CustomerCheckout;
}

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  _isPaymentSucceess: false,
  _priceChanged: false,
  _isFetchCodCodeSuccess: false,
  message: '',
  data: {}
} as Checkout;

enum Actions {
  LOADING_CHECKOUT = 'LOADING_CHECKOUT',
  ERROR_CHECKOUT = 'ERROR_CHECKOUT',
  SUCCESS_CHECKOUT_ORDER = 'SUCCESS_CHECKOUT_ORDER',
  DEFAULT_CHECKOUT = 'DEFAULT_CHECKOUT',
  SET_CHECKOUT = 'SET_CHECKOUT',
  UPDATE_CHECKOUT_SUCCESS = 'UPDATE_CHECKOUT_SUCCESS',
  SUCCESS_PAYMENT = 'SUCCESS_PAYMENT',
  PRICE_CHANGED = 'PRICE_CHANGED',
};

const loadingCheckout = () => ({
  type: Actions.LOADING_CHECKOUT
});

const successCheckoutOrder = (data: CustomerCheckout, message?: string) => ({
  type: Actions.SUCCESS_CHECKOUT_ORDER,
  data,
  message
});

const errorCheckout = (message: string) => ({
  type: Actions.ERROR_CHECKOUT,
  message
});

const defaultCheckout = () => ({
  type: Actions.DEFAULT_CHECKOUT
});

const successPayment =(message:string) => ({
  type: Actions.SUCCESS_PAYMENT,
  message
});

const priceChanged = (message:string) => ({
  type: Actions.PRICE_CHANGED,
  message
});

const checkoutReducer = (state = initialState, action: CheckoutAction) : Checkout => {
  switch(action.type){
    case Actions.LOADING_CHECKOUT:
      return{
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess:false,
        _isPaymentSucceess: false,
        _priceChanged: false,
        message: ''
      }
    case Actions.SUCCESS_CHECKOUT_ORDER:
      return{
        ...state,
        _isLoading: false,
        _isError: false,
        _isSuccess:false,
        _isPaymentSucceess: false,
        _priceChanged: false,
        _isFetchCodCodeSuccess: true,
        message: action.message,
        data: action.data
      }
    case Actions.PRICE_CHANGED:
      return{
        ...state,
        _isLoading: false,
        _isError: false,
        _isSuccess:false,
        _isPaymentSucceess: false,
        _priceChanged: true,
        message: action.message
      }
    case Actions.ERROR_CHECKOUT:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        _isPaymentSucceess: false,
        _priceChanged: false,
        _isFetchCodCodeSuccess: false,
        message: action.message
      }
    case Actions.DEFAULT_CHECKOUT:
      return {
        ...state,
        ...initialState,
        _isPaymentSucceess: false,
        _priceChanged: false,
        _isFetchCodCodeSuccess: false,
      }
    case Actions.SUCCESS_PAYMENT:
      return {
        ...state,
        _isError: false,
        _isLoading: false,
        _isSuccess: false,
        _isPaymentSucceess: true,
        _priceChanged: false,
        message: action.message
      }
    default:
      return state;
  }
};

// Thunk

const getRazorPayOrder = (amount: string, orderId: number, couponId?: number) => async (dispatch: Dispatch<CheckoutAction>) => {
  dispatch(loadingCheckout());
  const response = await api.post('/checkout',
    {
      amount,
      displayAmount: amount,
      orderId,
      couponId
    });
    if (response.status === HttpStatusCode.OK) {
      const res = response.data as CheckoutResponse;
      dispatch(successCheckoutOrder(res.data || {} as CustomerCheckout, res.message || ''));
    } else if(response.status === HttpStatusCode.PARTIAL_INFO){
      const res = response.data as CheckoutResponse;
      dispatch(priceChanged(res.message || ''));
    } else {
      const res = response as CheckoutResponse;
      dispatch(errorCheckout(res.message || ''));
    }
};

const saveRazorPayOrder = (razorpayData: RazorpayPayment) => async (dispatch: Dispatch<CheckoutAction>) => {
  dispatch(loadingCheckout());
  const response = await api.post('/payment/razorpay',razorpayData);
    if (response.status === HttpStatusCode.OK) {
      const res = response.data as CheckoutResponse
      dispatch(successPayment(res.message || ''));
    } else {
      const res = response as CheckoutResponse
      dispatch(errorCheckout(res.message || ''));
    }
};

const getPayPalOrder = (amount: string, displayAmount: string ,orderId: number, couponId?: number)  => async (dispatch: Dispatch<CheckoutAction>) => {
  dispatch(loadingCheckout());
  const response = await api.post('/paypalorder',
  {
    amount,
    displayAmount,
    orderId,
    couponId
  });
  if (response.status === HttpStatusCode.OK) {
    const res = response.data as CheckoutResponse
    dispatch(successCheckoutOrder(res.data as CustomerCheckout, res.message || ''));
  } else if(response.status === HttpStatusCode.PARTIAL_INFO){
    const res = response.data as CheckoutResponse;
    dispatch(priceChanged(res.message || ''));
  } else {
    const res = response as CheckoutResponse
    dispatch(errorCheckout(res.message || ''));
  }
};

const savePayPalOrder = (paypalData: PayPalPayment) => async (dispatch: Dispatch<CheckoutAction>) => {
  dispatch(loadingCheckout());
  const response = await api.post('/payment/paypal',paypalData);
    if (response.status === HttpStatusCode.OK) {
      const res = response.data as CheckoutResponse
      dispatch(successPayment(res.message || ''));
    } else {
      const res = response as CheckoutResponse
      dispatch(errorCheckout(res.message || ''));
    }
};

const getCodOrder = (amount: string, orderId: number, couponId?: number) => async (dispatch: Dispatch<CheckoutAction>) => {
  dispatch(loadingCheckout());
  const response = await api.post('/payment/codorder',{
    amount,
    displayAmount: amount,
    orderId,
    couponId
  });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as CheckoutResponse;
    dispatch(successCheckoutOrder(res.data as CustomerCheckout, res.message || ''));
  } else if(response.status === HttpStatusCode.PARTIAL_INFO){
    const res = response.data as CheckoutResponse;
    dispatch(priceChanged(res.message || ''));
  } else {
    const res = response as CheckoutResponse;
    dispatch(errorCheckout(res.message || ''));
  }
};

const saveCodOrder = (codData: CodPayment) => async (dispatch: Dispatch<CheckoutAction>) => {
  dispatch(loadingCheckout());
  const response = await api.post('/payment/codplaceorder',codData);
  if (response.status === HttpStatusCode.OK) {
    const res = response.data as CheckoutResponse
    dispatch(successPayment(res.message || ''));
  } else {
    const res = response as CheckoutResponse
    dispatch(errorCheckout(res.message || ''));
  }
};

const resendOTP = () => async (dispatch: Dispatch<CheckoutAction>) => {
  dispatch(loadingCheckout());
  const response = await api.get('/payment/codresendotp');
  if (response.status === HttpStatusCode.OK) {
    const res = response.data as CheckoutResponse;
    dispatch(successCheckoutOrder(res.data as CustomerCheckout, res.message || ''));
  } else {
    const res = response as CheckoutResponse;
    dispatch(errorCheckout(res.message || ''));
  }
};

export{
  getRazorPayOrder,
  checkoutReducer,
  saveRazorPayOrder,
  errorCheckout,
  getPayPalOrder,
  savePayPalOrder,
  getCodOrder,
  saveCodOrder,
  resendOTP,
  defaultCheckout
}