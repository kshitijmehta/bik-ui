import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, Coupon, saveCoupon } from 'reducers';
import { ProductCoupon as ProductCouponType } from 'types';
import { NotificationContainer } from 'components/shared';

const ProductCoupon: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const couponFormik = useFormik({
    initialValues: {
      code: '',
      value: ''
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required')
    }),
    onSubmit: (values: ProductCouponType) => {
      dispatch(saveCoupon(values));
    }
  });
  const couponActionStatus = useSelector<AppState, Coupon>(state => state.coupon);
  useEffect(() => {
    if (couponActionStatus._isSuccess) {
      couponFormik.resetForm();
    }
  }, [couponActionStatus._isSuccess])
  return (
    <form onSubmit={couponFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Coupon</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Coupon Code</div>
                      <input className="uk-input " id="code" type="input"
                        {...couponFormik.getFieldProps('code')} />
                      {
                        couponFormik.touched.code && couponFormik.errors.code ? (
                          <span className="uk-text-danger">{couponFormik.errors.code}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Discount Percentage</div>
                      <input className="uk-input " type="input"
                        {...couponFormik.getFieldProps('value')} />
                      {
                        couponFormik.touched.value && couponFormik.errors.value ? (
                          <span className="uk-text-danger">{couponFormik.errors.value}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className="uk-card-footer uk-text-center">
          <NotificationContainer {...couponActionStatus}/>
          <button disabled={couponActionStatus._isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              couponActionStatus._isLoading &&
              <img className="login-button-padding" src="tail-spin.svg" />
            }
            <span>Save</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export {
  ProductCoupon
}