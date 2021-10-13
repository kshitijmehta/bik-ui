import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, addUpdateSize , Size } from 'reducers';
import { ProductSize as ProductSizeType } from 'types';
import { NotificationContainer } from 'components/shared';


const ProductSize: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const sizeFormik = useFormik({
    initialValues: {
      code: '',
      value: '',
      productCategory: 1,
      sizeId: '0'
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required'),
      productCategory: Yup.number().required('Required')
    }),
    onSubmit: (values: ProductSizeType) => {
      dispatch(addUpdateSize (values));
    }
  });
  const sizeActionStatus = useSelector<AppState, Size>(state => state.size);
  useEffect(() => {
    if (sizeActionStatus._isSuccess) {
      sizeFormik.resetForm();
    }
  }, [sizeActionStatus._isSuccess])
  return (
    <form onSubmit={sizeFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Size</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
                <div>
                    <label>
                      <div className="uk-form-label">Product Category</div>
                      <select className="uk-select" id="productCategory"
                        {...sizeFormik.getFieldProps('productCategory')}>
                          <option key='1' value={1}>Lingerie</option>
                          <option key='2' value={2}>Footwear</option>
                          <option key='3' value={3}>Bindi</option>
                          <option key='4' value={8}>Home Essential</option>
                          <option key='5' value={9}>Cosmetics</option>
                          <option key='6' value={10}>Fashion Accessories</option>
                        </select>
                      {
                        sizeFormik.touched.productCategory && sizeFormik.errors.productCategory ? (
                          <span className="uk-text-danger">{sizeFormik.errors.productCategory}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Size Code</div>
                      <input className="uk-input " id="code" type="input"
                        {...sizeFormik.getFieldProps('code')} />
                      {
                        sizeFormik.touched.code && sizeFormik.errors.code ? (
                          <span className="uk-text-danger">{sizeFormik.errors.code}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Size Value</div>
                      <input className="uk-input " type="input"
                        {...sizeFormik.getFieldProps('value')} />
                      {
                        sizeFormik.touched.value && sizeFormik.errors.value ? (
                          <span className="uk-text-danger">{sizeFormik.errors.value}</span>
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
          <NotificationContainer {...sizeActionStatus}/>
          <button disabled={sizeActionStatus._isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              sizeActionStatus._isLoading &&
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
  ProductSize
}