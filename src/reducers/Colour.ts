import { Action, Dispatch } from "redux";
import { ProductColor } from "types";
import { api } from "services";
import { HttpStatusCode } from "appConstants";

export interface ColourAction extends Action {
  readonly message?: string;
  readonly data?: ProductColor[]
}

export interface ColourResponse {
  message?: string
  data?: ProductColor[]
}

export interface Colour {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly message?: string;
  readonly data?: ProductColor[];
}

const initialState = {
  _isLoading: false,
  _isError: false,
  _isSuccess: false,
  message: '',
  data: {}
} as Colour;

enum Actions {
  LOADING_COLOUR = 'LOADING_COLOUR',
  ERROR_COLOUR = 'ERROR_COLOUR',
  SUCCESS_COLOUR = 'SUCCESS_COLOUR',
  DEFAULT_COLOUR = 'DEFAULT_COLOUR',
  SET_COLOUR = 'SET_COLOUR',
  UPDATE_COLOUR_SUCCESS = 'UPDATE_COLOUR_SUCCESS'
};

const loadingColour = () => ({
  type: Actions.LOADING_COLOUR
});

const successColour = (message: string) => ({
  type: Actions.SUCCESS_COLOUR,
  message
});

const errorColour = (message: string) => ({
  type: Actions.ERROR_COLOUR,
  message
});

const defaultColour = () => ({
  type: Actions.DEFAULT_COLOUR
});

const setColour = (data: ProductColor[]) => ({
  type: Actions.SET_COLOUR,
  data
});

const updateColourSuccess = (data: ProductColor[], message: string) => ({
  type: Actions.UPDATE_COLOUR_SUCCESS,
  data,
  message
});

const colourReducer = (state = initialState, action: ColourAction): Colour => {
  switch (action.type) {
    case Actions.LOADING_COLOUR:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess:false,
        message: ''
      }
    case Actions.SUCCESS_COLOUR:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.ERROR_COLOUR:
      return {
        ...state,
        _isError: true,
        _isLoading: false,
        _isSuccess: false,
        message: action.message
      }
    case Actions.SET_COLOUR:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: action.data
      }
    case Actions.UPDATE_COLOUR_SUCCESS:
      const originalState = state.data || [];
      const updatedValue = action.data || [];
      const updatedState = originalState.filter(d => {
        return d.colourId != updatedValue[0].colourId
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
    case Actions.DEFAULT_COLOUR:
      return {
        ...state,
        ...initialState
      }
    default:
      return state
  }
}

const saveColour = (colour: ProductColor) => async (dispatch: Dispatch<ColourAction>) => {
  dispatch(loadingColour());
  const response = await api.post('/productcolour',
    {
      product_color_code: colour.code,
      product_color: colour.value,
      colour_id: 0
    });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ColourResponse
    dispatch(successColour(res.message || ''));
  } else {
    const res = response as ColourResponse
    dispatch(errorColour(res.message || ''));
  }
}

const getColour = () => async (dispatch: Dispatch<ColourAction>) => {
  dispatch(loadingColour());

  const response = await api.get('/productcolour');
  if(response.status === HttpStatusCode.OK){
    const res = response.data as ColourResponse;
    dispatch(setColour(res.data || []));
  } else {
    const res = response as ColourResponse;
    dispatch(errorColour(res.message || ''))
  }
}

const updateColour = (colour: ProductColor) => async (dispatch: Dispatch<ColourAction>) => {
  dispatch(loadingColour());

  const response = await api.post('/productcolour', {
    product_color_code: colour.code,
    product_color: colour.value,
    colour_id: colour.colourId
  });

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ColourResponse
    dispatch(updateColourSuccess([colour], res.message || ''));
  } else {
    const res = response as ColourResponse
    dispatch(errorColour(res.message || ''));
  }

}

export {
  colourReducer,
  saveColour,
  defaultColour,
  getColour,
  updateColour
}