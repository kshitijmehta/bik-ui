import { Action, Dispatch } from 'redux';
import { ProductItem, sizeColourQuantityComboObject } from 'types';
import { api } from 'services';
import { HttpStatusCode, pageSize } from 'appConstants';
import { boolean } from 'yup';
import { getUserLocation } from './UserLocation';

export interface ProductAction extends Action {
  readonly message?: string;
  readonly data?: ProductItem[];
  _hasMoreProducts?: boolean;
  readonly singleData?: ProductItem;
}

interface ProductResponse {
  message?: string;
  data?: ProductItem[];
  readonly singleData?: ProductItem;
}

export interface Product {
  readonly _isLoading: boolean;
  readonly _isError: boolean;
  readonly _isSuccess: boolean;
  readonly _hasMoreProducts?: boolean;
  readonly message?: string;
  readonly data?: ProductItem[];
  readonly singleData?: ProductItem;
}

enum Actions {
  LOADING_PRODUCT = 'LOADING_PRODUCT',
  SUCCESS_PRODUCT = 'SUCCESS_PRODUCT',
  ERROR_PRODUCT = 'ERROR_PRODUCT',
  SET_PRODUCT = 'SET_PRODUCT',
  SET_CUSTOMER_PRODUCT = 'SET_CUSTOMER_PRODUCT',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  SET_SINGLE_PRODUCT = 'SET_SINGLE_PRODUCT',
  SET_DEFAULT_PRODUCT = 'SET_DEFAULT_PRODUCT',
  DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS',
  SET_PRODUCT_HIGHLIGHT = 'SET_PRODUCT_HIGHLIGHT'
}

const loadingProduct = () => ({
  type: Actions.LOADING_PRODUCT
});

const successProduct = (message: string) => ({
  type: Actions.SUCCESS_PRODUCT,
  message
});

const errorProduct = (message: string) => ({
  type: Actions.ERROR_PRODUCT,
  message
});

const setProducts = (data: ProductItem[], _hasMoreProducts: boolean) => ({
  type: Actions.SET_PRODUCT,
  data,
  _hasMoreProducts
});

const setSingleProducts = (singleData: ProductItem) => ({
  type: Actions.SET_SINGLE_PRODUCT,
  singleData
});

const setDefaulState = () => ({
  type: Actions.SET_DEFAULT_PRODUCT
});

const deleteProductSuccess = (data: ProductItem[], message: string) => ({
  type: Actions.DELETE_PRODUCT_SUCCESS,
  data,
  message
});

const setCustomerProducts = (data: ProductItem[], _hasMoreProducts: boolean) => ({
  type: Actions.SET_CUSTOMER_PRODUCT,
  data,
  _hasMoreProducts
});

const setProductHighlight = (trending: boolean, latest: boolean, productId: string, message: string)  => ({
  type: Actions.SET_PRODUCT_HIGHLIGHT,
  message,
  singleData: {
    trending,
    latest,
    productId
  } as ProductItem
})

const initialState = {
  _isSuccess: false,
  _isLoading: false,
  _isError: false,
  _hasMoreProducts: true,
  message: '',
  data: [],
  singleData: {} as ProductItem
} as Product

const productReducer = (state = initialState, action: ProductAction): Product => {
  switch (action.type) {
    case Actions.LOADING_PRODUCT:
      return {
        ...state,
        _isLoading: true,
        _isError: false,
        _isSuccess: false
      }
    case Actions.SUCCESS_PRODUCT:
      return {
        ...state,
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.ERROR_PRODUCT:
      return {
        ...state,
        _isError: true,
        _isSuccess: false,
        _isLoading: false,
        message: action.message
      }
    case Actions.SET_PRODUCT:
      return {
        ...state,
        _isSuccess: false,
        _isError: false,
        _isLoading: false,
        data: action.data,
        _hasMoreProducts: action._hasMoreProducts,
      }
    case Actions.SET_CUSTOMER_PRODUCT:
        return {
          ...state,
          _isSuccess: false,
          _isError: false,
          _isLoading: false,
          data: state.data?.concat(action.data || []),
          _hasMoreProducts: action._hasMoreProducts
        }
    case Actions.SET_SINGLE_PRODUCT:
      return {
        ...state,
        _isSuccess: false,
        _isError: false,
        _isLoading: false,
        singleData: action.singleData
      }
    case Actions.DELETE_PRODUCT_SUCCESS:
      const orgState = state.data || [];
      const updValue = action.data || [];
      const updState = orgState.filter(d => {
        return d.productId != updValue[0].productId
      });
      return {
        _isSuccess: false,
        _isError: false,
        _isLoading: false,
        data: [
          ...updState
        ]
      }
    case Actions.SET_PRODUCT_HIGHLIGHT:
      return {
        _isSuccess: true,
        _isError: false,
        _isLoading: false,
        message: action.message,
        data: state.data?.map((product) => {
          if(product.productId.toString() === action.singleData?.productId.toString()){
            return {...product, trending: action.singleData.trending, latest: action.singleData.latest}
          }
          return product
        })
      }
    case Actions.SET_DEFAULT_PRODUCT:
      return {
        ...state,
        ...initialState
      }
    default:
      return state
  }
}

/*Thunk */

const addUpdateProduct = (product: ProductItem, isDelete = 0, sizeColourQuantity: sizeColourQuantityComboObject[]) => async (dispatch: Dispatch<ProductAction>) => {
  dispatch(loadingProduct());
  var formData = new FormData();
  if (product.productImageBlob) {
    Array.from(product.productImageBlob).forEach((element, index) => {
      formData.append(`product_image_${index}`, element);
    });
  }
  formData.append('product_INR_price', product.priceINR);
  formData.append('product_USD_price', product.priceUSD);
  formData.append('product_size_code', product.size || '0');
  formData.append('product_color_code', product.colour || '0');
  formData.append('product_Qty', product.quantity || '0');
  formData.append('product_name', product.name);
  formData.append('product_desc', product.description || '');
  formData.append('product_subcategory_id', (product.subCategory || '').toString());
  formData.append('prod_id', product.productId);
  formData.append('is_product_delete', isDelete.toString());
  formData.append('deleted_image_paths', JSON.stringify(product.deletedImagePath));
  formData.append('size_colour_quantity_combo',  JSON.stringify(sizeColourQuantity));
  formData.append('deleted_product_detailIds',  JSON.stringify(product.deletedProductDetailIds));
  const response = await api.post('/productinfo', formData);

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ProductResponse;
    if (product.productId != '0') {
      if (isDelete) {
        dispatch(deleteProductSuccess([product], res.message || ''))
      } else {
        dispatch(successProduct(res.message || ''));
      }
    } else {
      dispatch(successProduct(res.message || ''));
    }
  } else {
    const res = response as ProductResponse;
    dispatch(errorProduct(res.message || ''));
  }

};

const getProducts = () => async (dispatch: Dispatch<ProductAction>) => {
  dispatch(loadingProduct());
  const response = await api.get('/productinfo');

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ProductResponse;
    dispatch(setProducts(res.data || [], true))
  } else {
    const res = response as ProductResponse;
    dispatch(errorProduct(res.message || ''));
  }
};

const getProduct = (productId: number) => async (dispatch: Dispatch<ProductAction>) => {
  dispatch(loadingProduct());
  const response = await api.get('/productinfo?productId=' + productId);

  if (response.status === HttpStatusCode.OK) {
    const res = response.data as ProductResponse;
    dispatch(setSingleProducts(res.singleData || {} as ProductItem))
  } else {
    const res = response as ProductResponse;
    dispatch(errorProduct(res.message || ''));
  }
};

const getCustomerProducts = (
  offset: number,
  limit: number,
  categoryId: number[],
  subCategoryId: number[],
  colourId: number[],
  sizeId: number[],
  startPrice: string,
  endPrice: string,
  currency: string,
  searchText: string,
  freshData = false) => async (dispatch: Dispatch<ProductAction>) => {
    dispatch(loadingProduct());

    const response = await api.get(
      `/productlistcustomer?offset=${offset}&limit=${limit}&categorydId=${categoryId}&colourId=${colourId}&sizeId=${sizeId}&subCategoryId=${subCategoryId}&startPrice=${startPrice}&endPrice=${endPrice}&currency=${currency}&searchText=${searchText}`);

    if (response.status === HttpStatusCode.OK) {
      const res = response.data as ProductResponse;
      const _hasMoreProducts = res.data && res.data.length === pageSize || false;
      if(freshData){
        dispatch(setProducts(res.data || [], _hasMoreProducts))
      }else {
        dispatch(setCustomerProducts(res.data || [], _hasMoreProducts))
      }
      
    } else {
      const res = response as ProductResponse;
      dispatch(errorProduct(res.message || ''));
    }
  }

  const updateProductHighLight = (highlight: string, productId: string) => async(dispatch: Dispatch<ProductAction>) => {
    dispatch(loadingProduct());
    const latest =  highlight === '2';
    const trending = highlight === '1';
    const response = await api.post('/producthighlight',{
      latest,
      trending,
      productId
    });

    if(response.status === HttpStatusCode.OK){
      const res = response.data as ProductResponse;
      dispatch(setProductHighlight(trending,latest, productId, res.message || ''))
    } else {
      const res = response as ProductResponse;
      dispatch(errorProduct(res.message || ''));
    }
  }

export {
  addUpdateProduct,
  productReducer,
  getProducts,
  getProduct,
  setDefaulState,
  getCustomerProducts,
  updateProductHighLight,
  errorProduct
}
