import React from 'react';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { ProductCoupon } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, updateCoupon, Coupon } from 'reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';

const CouponList: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const deleteCoupon = (couponId:  number, code:string, value:string) => {
    const input = window.confirm('Sure want to delete?');
    if(input)dispatch(updateCoupon({couponId,value,code},true));
  } 
  const stateData = useSelector<AppState, ProductCoupon[]>(state => state.coupon.data || []);  
  const productColumns = [
    {
      name: 'CouponId',
      selector: 'couponId',
      sortable: false,
    },
    {
      name: 'Coupon Code',
      selector: 'code',
      sortable: true,
    },
    {
      name: 'Coupon Value',
      selector: 'value',
      sortable: true,
    },
    {
      name: 'Delete',
      sortable: false,
      cell: (row: { couponId: number, code: string, value: string }) => {
        return  <button type="submit" className="uk-button-small uk-button-danger" onClick={() => deleteCoupon(row.couponId, row.value, row.code)}>
                   <span>Delete</span>
                </button>
      }
    },
  ]

  return(
    <AdminProductList 
      productColumns={productColumns} 
      productType={SubProducts.COUPONS} 
      ExpandableComponent= {ExpandableComponent}
      stateData={stateData}
      searchPlaceholder="Search Coupon Code"
      expandableRows = {true}/>
  )
}

const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const { code, value, couponId }: ProductCoupon = data;
  const couponActionStatus = useSelector<AppState, Coupon>(state => state.coupon);

  const couponQuickViewFormik = useFormik({
    initialValues: {
      code,
      value,
      couponId
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required')
    }),
    onSubmit: (value: ProductCoupon) => {
      dispatch(updateCoupon(value));
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
  CouponList,
  ExpandableComponent
}