import { Action } from "redux";
import { CustomerShippment as CustomerShippmentType } from "types";

export interface CustomerShippmentAction extends Action {
  readonly data?: CustomerShippmentType
}

export interface CustomerShippment {
  readonly data?: CustomerShippmentType;
}

const initialState = {
  data: {
    shippmentPrice: ''
  }
} as CustomerShippment;

enum Actions {
  SET_SHIPPING_PRICE = 'SET_SHIPPING_PRICE',
}

const setShippingPrice = (data: CustomerShippmentType) => ({
  type: Actions.SET_SHIPPING_PRICE,
  data
});

const customerShippmentReducer = (state = initialState, action: CustomerShippmentAction): CustomerShippment => {
  switch(action.type){
    case Actions.SET_SHIPPING_PRICE:
      return{
        ...state,
        data:{
          shippmentPrice: action.data?.shippmentPrice || ''
        }
      }
    default:
      return state
  }
}


export {
  customerShippmentReducer,
  setShippingPrice
}