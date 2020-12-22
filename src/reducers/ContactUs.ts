import { Action, Dispatch } from "redux";
import { ContactUs as ContactUsType } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

export interface ContactUsAction extends Action {
  readonly message?: string;
  readonly data?: ContactUsType
}

export interface ContactUsResponse {
  message?: string
  data?: ContactUsType
}

export interface ContactUs {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ContactUsType;
}

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  message: '',
  data: {}
} as ContactUs;

enum Actions {
  LOADING_CONTACTUS = 'LOADING_CONTACTUS',
  ERROR_CONTACTUS = 'ERROR_CONTACTUS',
  SUCCESS_CONTACTUS = 'SUCCESS_CONTACTUS',
};

const loadingContactUs = () => ({
  type: Actions.LOADING_CONTACTUS
});

const successContactUs = (message: string) => ({
  type: Actions.SUCCESS_CONTACTUS,
  message
});

const errorContactUs = (message: string) => ({
  type: Actions.ERROR_CONTACTUS,
  message
});

const contactUsReducer = (state = initialState, action: ContactUsAction): ContactUs => {
  switch (action.type) {
    case Actions.LOADING_CONTACTUS:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess:false,
        message: ''
      }
    case Actions.SUCCESS_CONTACTUS:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.ERROR_CONTACTUS:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        message: action.message
      }
    default:
      return state
  }
}

const sendContactUsQuery = (contactUs: ContactUsType) => async (dispatch: Dispatch<ContactUsAction>) => {
  dispatch(loadingContactUs());
  const response = await api.post('/contactus',
    {
      email: contactUs.email,
      name: contactUs.name,
      message: contactUs.message
    });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ContactUsResponse
    dispatch(successContactUs(res.message || ''));
  } else {
    const res = response as ContactUsResponse
    dispatch(errorContactUs(res.message || ''));
  }
}

export {
  contactUsReducer,
  sendContactUsQuery
}