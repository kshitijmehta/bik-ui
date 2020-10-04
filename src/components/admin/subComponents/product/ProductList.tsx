import React from 'react';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { ProductItem } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { AppState, addUpdateProduct, Coupon } from 'reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';

interface Props{
  addEditToggle: Function;
}

const ProductList: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const deleteProduct = (productId:  string) => {
    const input = window.confirm('Sure want to delete?');
    const name = '',code = '',priceINR = '0',priceUSD ='0', value = '',subCategory=1, deletedImagePath= ['']
    if(input)dispatch(addUpdateProduct({productId, name, code, priceUSD, priceINR, value,deletedImagePath, subCategory},1));
  } 
  const stateData = useSelector<AppState, ProductItem[]>(state => state.product.data || []);  
  const productColumns = [
    // {
    //   name: 'ProductId',
    //   selector: 'productId',
    //   sortable: false,
    // },
    {
      name: 'Category',
      selector: 'productCategoryName',
      sortable: true
    },
    {
      name: 'Product Name',
      selector: 'name',
      sortable: true,
    },
    // {
    //   name: 'Price INR',
    //   selector: 'priceInr',
    //   sortable: true,
    // },
    // {
    //   name: 'Price USD',
    //   selector: 'priceUsd',
    //   sortable: true,
    // },
    {
      name: 'Quantity',
      selector: 'quantity',
      sortable: true,
    },
    {
      name: 'Colour',
      selector: 'colour',
      sortable: true,
    },
    {
      name: 'Size',
      selector: 'size',
      sortable: true,
    },
    {
      name: 'Delete',
      sortable: false,
      cell: (row: { productId: number, name: string, code: string, priceUSD: string, priceINR: string, value: string }) => {
        return  <button type="submit" className="uk-button-small uk-button-danger" onClick={() => deleteProduct(row.productId.toString())}>
                   <span>Delete</span>
                </button>
      }
    },
    {
      name: 'Edit',
      sortable: false,
      cell: (row: { productId: number, code: string, value: string }) => {
        return  <button type="submit" className="uk-button-small uk-button-danger" onClick={() => { props.addEditToggle(true); history.push("/admin/product/"+row.productId)}}>
                   <span>Edit</span>
                </button>
      }
    },
  ]

  return(
    <AdminProductList 
      productColumns={productColumns} 
      productType={SubProducts.PRODUCT} 
      ExpandableComponent= {ExpandableComponent}
      stateData={stateData}
      searchPlaceholder="Search Product Name"
      expandableRows = {false}/>
  )
}

const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const { code, value, productId, name, priceINR, priceUSD  }: ProductItem = data;
  const couponActionStatus = useSelector<AppState, Coupon>(state => state.coupon);

  const couponQuickViewFormik = useFormik({
    initialValues: {
      code,
      value,
      productId,
      name,
      priceINR,
      priceUSD
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required')
    }),
    onSubmit: (value: ProductItem) => {
      // dispatch(updateCoupon(value));
    }
  });
  return (
    <form onSubmit={couponQuickViewFormik.handleSubmit} className="quick-edit-admin uk-grid-medium uk-child-width-1-1" uk-grid="true">
      <fieldset className="uk-fieldset">
        <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
          <div>
            <label>
              <div className="uk-form-label">Coupon Code</div>
              <input className="uk-input " id="code" type="input"
                {...couponQuickViewFormik.getFieldProps('code')} />
              {
                couponQuickViewFormik.touched.code && couponQuickViewFormik.errors.code ? (
                  <span className="uk-text-danger">{couponQuickViewFormik.errors.code}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Discount Percentage</div>
              <input className="uk-input " type="input"
                {...couponQuickViewFormik.getFieldProps('value')} />
              {
                couponQuickViewFormik.touched.value && couponQuickViewFormik.errors.value ? (
                  <span className="uk-text-danger">{couponQuickViewFormik.errors.value}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Coupon Update</div>
              <button type="submit" className="uk-button uk-button-primary ">
                {
                  couponActionStatus._isLoading &&
                  <img className="login-button-padding" src="tail-spin.svg" />
                }
                <span>Save</span>
              </button>
            </label>
          </div>
        </div>
        <div className="extended-component-notification">
        {couponQuickViewFormik.isSubmitting && <NotificationContainer {...couponActionStatus}/>}
        </div>
      </fieldset>
    </form>
  )
}

export {
  ProductList,
  ExpandableComponent
}