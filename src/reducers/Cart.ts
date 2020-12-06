import { Action, Dispatch } from "redux";
import { CustomerCart } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

export interface CartAction extends Action {
  readonly message?: string;
  readonly data?: CustomerCart[]
}

export interface CartResponse {
  message?: string;
  data?: CustomerCart;
}

export interface CartResponseMulti {
  message?: string;
  data?: CustomerCart[];
}

export interface Cart {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly _quantityUpdate: boolean;
  readonly message?: string;
  readonly data?: CustomerCart[];
}

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  _quantityUpdate: false,
  message: '',
  data: []
} as Cart;

enum Actions {
  LOADING_CART = 'LOADING_CART',
  ERROR_CART = 'ERROR_CART',
  SUCCESS_CART = 'SUCCESS_CART',
  DEFAULT_CART = 'DEFAULT_CART',
  SET_CART = 'SET_CART',
  SET_LOGGED_CART = 'SET_LOGGED_CART',
  UPDATE_CART_SUCCESS = 'UPDATE_CART_SUCCESS',
  ADD_CART_SUCCESS = 'ADD_CART_SUCCESS',
  UPDATE_CART_LOGGED_OUT = 'UPDATE_CART_LOGGED_OUT',
  DELETE_CART_PRODUCT = 'DELETE_CART_PRODUCT',
  CART_QUANTITY_FINE = 'CART_QUANTITY_FINE',
  CART_GET_UPDATED_QUANTITY = 'CART_GET_UPDATED_QUANTITY',
  DELETE_CART_PRODUCT_LOGGED_OUT = 'DELETE_CART_PRODUCT_LOGGED_OUT',
};

const loadingCart = () => ({
  type: Actions.LOADING_CART
});

const successCart = (message: string) => ({
  type: Actions.SUCCESS_CART,
  message
});

const errorCart = (message: string) => ({
  type: Actions.ERROR_CART,
  message
});

const defaultCart = () => ({
  type: Actions.DEFAULT_CART
});

const setCart = (data: CustomerCart[]) => ({
  type: Actions.SET_CART,
  data
});

const setLoggedCart = (data: CustomerCart[]) => ({
  type: Actions.SET_LOGGED_CART,
  data
});

const updateCartSuccess = (data: CustomerCart[], message: string) => ({
  type: Actions.UPDATE_CART_SUCCESS,
  data,
  message
});

const addCartSuccess = (data: CustomerCart[], message: string) => ({
  type: Actions.ADD_CART_SUCCESS,
  data,
  message
});

const addCartSuccessLoggedOut = (data: CustomerCart[], message: string) => ({
  type: Actions.UPDATE_CART_LOGGED_OUT,
  data,
  message
});

const deleteCartProduct = (data: CustomerCart[], message: string) => ({
  type: Actions.DELETE_CART_PRODUCT,
  data,
  message
});

const cartQuantityFine = () => ({
  type: Actions.CART_QUANTITY_FINE
});

const cartGetUpdatedQuantity = () => ({
  type: Actions.CART_GET_UPDATED_QUANTITY
});

const deleteCartLoggedOut = (data: CustomerCart[]) =>({
  type: Actions.DELETE_CART_PRODUCT_LOGGED_OUT,
  data,
})

const cartReducer = (state = initialState, action: CartAction): Cart => {
  debugger;
  switch (action.type) {
    case Actions.LOADING_CART:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false,
        _quantityUpdate: false,
        message: ''
      }
    case Actions.SUCCESS_CART:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message
      }
    case Actions.ERROR_CART:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        _quantityUpdate: false,
        message: action.message
      }
    case Actions.SET_CART:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message,
        data: action.data
      }
    case Actions.SET_LOGGED_CART:
      debugger;
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message,
        data: action.data
      }
    case Actions.UPDATE_CART_SUCCESS:
      const originalState = state.data || [];
      let og = [];
      let newProduct = true;
      if (action.data && originalState.length === 0) {
        og = [...action.data]
      } else {
        og = originalState.map((product) => {
          if (action.data && product.cartId === action.data[0].cartId) {
            product.productQuantity = action.data[0].productQuantity;
            product.totalPrice = action.data[0].totalPrice;
            product.cartId = action.data[0].cartId;
            newProduct = false;
            return product;
          }
          return product;
        });
        if (newProduct && action.data) {
          og = [...og, ...action.data]
        }
      }
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message,
        data: og
      }
    case Actions.UPDATE_CART_LOGGED_OUT:
      const originalStatelo = state.data || [];
      let oglo = [];
      let newProductlo = true;
      if (action.data && originalStatelo.length === 0) {
        oglo = [...action.data]
      } else {
        oglo = originalStatelo.map((product) => {
          if (action.data && product.cartId === action.data[0].cartId) {
            product.productQuantity = (Number(action.data[0].productQuantity) + Number(product.productQuantity)).toString();
            product.totalPrice = ((Number(product.productQuantity)) * Number(action.data[0].productPrice)).toString();
            product.cartId = action.data[0].cartId;
            newProductlo = false;
            return product;
          }
          return product;
        });
        if (newProductlo && action.data) {
          oglo = [...oglo, ...action.data]
        }
      }
      localStorage.setItem("basicKart-loggedOutCart", JSON.stringify(oglo));
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message,
        data: oglo
      }
    case Actions.ADD_CART_SUCCESS:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message,
        data: action.data
      }
    case Actions.DELETE_CART_PRODUCT_LOGGED_OUT:
      const res = state.data?.filter(({ cartId }) => action.data && cartId !== action.data[0].cartId)
      localStorage.setItem("basicKart-loggedOutCart", JSON.stringify(res));
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message,
        data: res
      }
    case Actions.DELETE_CART_PRODUCT:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: false,
        message: action.message,
        data: state.data?.filter(({ cartId }) => action.data && cartId !== action.data[0].cartId)
      }
    case Actions.DEFAULT_CART:
      return {
        ...state,
        ...initialState
      }
    case Actions.CART_GET_UPDATED_QUANTITY:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        _quantityUpdate: true,
        message: action.message
      }
    case Actions.CART_QUANTITY_FINE:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        _quantityUpdate: true,
      }
    default:
      return state
  }
};

const addUpdateCart = (cart: CustomerCart, isLoggedIn?: boolean) =>
  async (dispatch: Dispatch<CartAction>) => {
    dispatch(loadingCart());
    if (!isLoggedIn) {
          // result.productImage = cart.productImage;
          // result.productImagePath = cart.productImagePath;
          // result.productName = cart.productName;
          // result.subcategory = cart.subcategory;
          // result.productId = cart.productId;
          const newCart = {
            ...cart,
            totalPrice: (Number(cart.productPrice) * Number(cart.productQuantity)).toString(),
          } as CustomerCart;
          dispatch(addCartSuccessLoggedOut([newCart],''));
    } else {
      const response = await api.post('/cart',
        {
          product_detail_id: cart.productDetailId.toString(),
          order_quantity: cart.productQuantity,
          price_id: cart.currencyType,
          orderdetail_id: cart.cartId.toString(),
          delete_flag: false
        });

      if (response.status === HttpStatusCode.OK) {
        const res = response.data as CartResponse;
        if (cart.cartId != '0') {
          const result = res.data || {} as CustomerCart;
          if (cart.productQuantity === '0') {
            dispatch(deleteCartProduct([cart], res.message || ''));
          } else {
            dispatch(updateCartSuccess([result], res.message || ''));
          }
        } else {
          const result = res.data || {} as CustomerCart;
          result.productImage = cart.productImage;
          result.productImagePath = cart.productImagePath;
          result.productName = cart.productName;
          result.subcategory = cart.subcategory;
          result.productId = cart.productId;
          dispatch(updateCartSuccess([result], res.message || ''));
        }
      } else {
        const res = response as CartResponse;
        dispatch(errorCart(res.message || ''));
      }
    }
  };

const getCart = () => async (dispatch: Dispatch<CartAction>) => {
  dispatch(loadingCart());

  const response = await api.get('/cart');
  if (response.status === HttpStatusCode.OK) {
    const res = response.data as CartResponseMulti;
    dispatch(addCartSuccess(res.data || [], res.message || ''));
  } else {
    const res = response as CartResponse;
    dispatch(errorCart(res.message || ''))
  }
};

const deleteCartItem = (cart: CustomerCart, isLoggedIn?: boolean) => async (dispatch: Dispatch<CartAction>) => {
  dispatch(loadingCart());

  if(!isLoggedIn){
    dispatch(deleteCartLoggedOut([cart]));
  }else {
    const response = await api.post('/cart', {
      orderdetail_id: cart.cartId,
      product_detail_id: cart.productDetailId.toString(),
      order_quantity: cart.productQuantity,
      price_id: '1',
      delete_flag: true
    });
    if (response.status === HttpStatusCode.OK) {
      const res = response.data as CartResponse;
      dispatch(deleteCartProduct([cart], res.message || ''));
    } else {
      const res = response as CartResponse;
      dispatch(errorCart(res.message || ''))
    }
  }
  
};

const updateCartQuantity = (orderDetailId: string) => async (dispatch: Dispatch<CartAction>) => {
  dispatch(loadingCart());
  const response = await api.post('/updatecartquantity', { orderDetailId });
  if (response.status === HttpStatusCode.OK) {
    dispatch(cartQuantityFine());
  } else if (response.status === HttpStatusCode.PARTIAL_INFO) {
    dispatch(cartGetUpdatedQuantity());
  } else {
    const res = response as CartResponse;
    dispatch(errorCart(res.message || ''))
  }
}

export {
  cartReducer,
  addUpdateCart,
  getCart,
  deleteCartItem,
  updateCartQuantity,
  setLoggedCart
}