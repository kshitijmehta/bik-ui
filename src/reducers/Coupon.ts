import { Action, Dispatch } from "redux";
import { ProductCoupon } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

export interface CouponAction extends Action {
  readonly message?: string;
  readonly data?: ProductCoupon[]
}

export interface CouponResponse {
  message?: string
  data?: ProductCoupon[]
}

export interface Coupon {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductCoupon[];
}

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  message: '',
  data: {}
} as Coupon

enum Actions {
  LOADING_COUPON = 'LOADING_COUPON',
  ERROR_COUPON = 'ERROR_COUPON',
  SUCCESS_COUPON = 'SUCCESS_COUPON',
  DEFAULT_COUPON = 'DEFAULT_COUPON',
  SET_COUPON = 'SET_COUPON',
  UPDATE_COUPON_SUCCESS = 'UPDATE_COUPON_SUCCESS',
  DELETE_COUPON_SUCCESS = 'DELETE_COUPON_SUCCESS'
}

const loadingCoupon = () => ({
  type: Actions.LOADING_COUPON
});

const successCoupon = (message: string) => ({
  type: Actions.SUCCESS_COUPON,
  message
});

const errorCoupon = (message: string) => ({
  type: Actions.ERROR_COUPON,
  message
});

const defaultCoupon = () => ({
  type: Actions.DEFAULT_COUPON
});

const setCoupon = (data: ProductCoupon[], message?: string) => ({
  type: Actions.SET_COUPON,
  data,
  message
});

const updateCouponSuccess = (data: ProductCoupon[], message: string) => ({
  type: Actions.UPDATE_COUPON_SUCCESS,
  data,
  message
});

const deleteCouponSuccess = (data: ProductCoupon[], message: string) => ({
  type: Actions.DELETE_COUPON_SUCCESS,
  data,
  message
});

const couponReducer = (state = initialState, action: CouponAction): Coupon => {
  switch (action.type) {
    case Actions.LOADING_COUPON:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess:false,
        message: ''
      }
    case Actions.SUCCESS_COUPON:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.ERROR_COUPON:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        message: action.message,
        data: []
      }
    case Actions.SET_COUPON:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: action.data
      }
    case Actions.UPDATE_COUPON_SUCCESS:
      const originalState = state.data || [];
      const updatedValue = action.data || [];
      const updatedState = originalState.filter(d => {
        return d.couponId != updatedValue[0].couponId
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
    case Actions.DELETE_COUPON_SUCCESS:
      const orgState = state.data || [];
      const updValue = action.data || [];
      const updState = orgState.filter(d => {
        return d.couponId != updValue[0].couponId
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
    case Actions.DEFAULT_COUPON:
      return {
        ...state,
        ...initialState
      }
    default:
      return state
  }
}

const saveCoupon = (coupon: ProductCoupon) => async (dispatch: Dispatch<CouponAction>) => {
  dispatch(loadingCoupon());
  const response = await api.post('/productcoupon',
    {
      coupon_code: coupon.code,
      coupon_value: coupon.value,
      coupon_id: 0,
      isDelete: false
    });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as CouponResponse
    dispatch(successCoupon(res.message || ''));
  } else {
    const res = response as CouponResponse
    dispatch(errorCoupon(res.message || ''));
  }
};

const getCoupon = () => async (dispatch: Dispatch<CouponAction>) => {
  dispatch(loadingCoupon());

  const response = await api.get('/productcoupon');
  if(response.status === HttpStatusCode.OK){
    const res = response.data as CouponResponse;
    dispatch(setCoupon(res.data || []));
  } else {
    const res = response as CouponResponse;
    dispatch(errorCoupon(res.message || ''))
  }
};

const updateCoupon = (coupon: ProductCoupon, isDelete= false) => async (dispatch: Dispatch<CouponAction>) => {
  dispatch(loadingCoupon());

  const response = await api.post('/productcoupon', {
    coupon_code: coupon.code,
    coupon_value: coupon.value,
    coupon_id: coupon.couponId,
    isDelete
  });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as CouponResponse;
    if(isDelete){
      dispatch(deleteCouponSuccess([coupon], res.message || ''))
    }else {
      dispatch(updateCouponSuccess([coupon], res.message || ''));
    }
  } else {
    const res = response as CouponResponse
    dispatch(errorCoupon(res.message || ''));
  }

};

const validateCoupon = (coupon: string) => async(dispatch: Dispatch<CouponAction>) => {
  dispatch(loadingCoupon());
  const response = await api.get('/validatecoupon?couponCode='+coupon);
  if(response.status === HttpStatusCode.OK){
    const res = response.data;
    if(res.data){
      dispatch(setCoupon([res.data], res.message || ''));
    } else {
      dispatch(errorCoupon(res.message || ''));
    }
  } else {
    const res = response as CouponResponse
    dispatch(errorCoupon(res.message || ''));
  }
};

export {
  couponReducer,
  saveCoupon,
  defaultCoupon,
  getCoupon,
  updateCoupon,
  validateCoupon
}