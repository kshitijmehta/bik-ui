import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, addUpdateSize, Size, addUpdateSubCategory, SubCategory } from 'reducers';
import { ProductSubCategory as ProductSubCategoryType } from 'types';
import { NotificationContainer } from 'components/shared';


const ProductSubCategory: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const subCategoryFormik = useFormik({
    initialValues: {
      code: '',
      value: '',
      productCategoryId: 0,
      subCategoryId: '0'
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required'),
      productCategoryId: Yup.number().required('Required').moreThan(0, 'Required')
    }),
    onSubmit: (values: ProductSubCategoryType) => {
      dispatch(addUpdateSubCategory(values));
    }
  });
  const subCategoryActionStatus = useSelector<AppState, SubCategory>(state => state.subCategory);
  useEffect(() => {
    if (subCategoryActionStatus._isSuccess) {
      subCategoryFormik.resetForm();
    }
  }, [subCategoryActionStatus._isSuccess])
  return (
    <form onSubmit={subCategoryFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">SubCategory</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Product Category</div>
                      <select className="uk-select" id="productCategoryId"
                        {...subCategoryFormik.getFieldProps('productCategoryId')}>
                        <option key='0' value={0}>Select</option>
                        <option key='1' value={1}>Lingerie</option>
                        <option key='2' value={2}>Footwear</option>
                        <option key='3' value={3}>Bindi</option>
                        <option key='4' value={8}>Home Essential</option>
                        <option key='5' value={9}>Cosmetics</option>
                      </select>
                      {
                        subCategoryFormik.touched.productCategoryId && subCategoryFormik.errors.productCategoryId ? (
                          <span className="uk-text-danger">{subCategoryFormik.errors.productCategoryId}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">SubCategory Name</div>
                      <input className="uk-input " id="code" type="input"
                        {...subCategoryFormik.getFieldProps('code')} />
                      {
                        subCategoryFormik.touched.code && subCategoryFormik.errors.code ? (
                          <span className="uk-text-danger">{subCategoryFormik.errors.code}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">SubCategory Description</div>
                      <input className="uk-input " type="input"
                        {...subCategoryFormik.getFieldProps('value')} />
                      {
                        subCategoryFormik.touched.value && subCategoryFormik.errors.value ? (
                          <span className="uk-text-danger">{subCategoryFormik.errors.value}</span>
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
          <NotificationContainer {...subCategoryActionStatus} />
          <button disabled={subCategoryActionStatus._isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              subCategoryActionStatus._isLoading &&
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
  ProductSubCategory
}